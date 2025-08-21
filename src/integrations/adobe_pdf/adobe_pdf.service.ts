import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import {
  MimeType,
  SDKError,
  PDFServices,
  CompressPDFJob,
  ServiceApiError,
  CompressionLevel,
  ServiceUsageError,
  CompressPDFResult,
  ServicePrincipalCredentials,
} from '@adobe/pdfservices-node-sdk';

@Injectable()
export class AdobePdfService {
  private clientId: string;
  private clientSecret: string;
  private readonly logger: Logger;

  constructor(private config: ConfigService) {
    this.logger = new Logger(AdobePdfService.name);
    this.clientId = this.config.get<string>('ADOBE_PDF_CLIENT_ID')!;
    this.clientSecret = this.config.get<string>('ADOBE_PDF_CLIENT_SECRET')!;
  }

  async compressPdf({ compressionLevel = 'HIGH', fileBase64, }: { compressionLevel?: 'HIGH' | 'MEDIUM' | 'LOW'; fileBase64: string; }) {
    const tempDir = path.resolve(__dirname, '../../temp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const tempFileName = `${uuidv4()}.pdf`;
    const inputPath = path.join(tempDir, tempFileName);
    const outputPath = path.join(tempDir, `compressed_${tempFileName}`);

    let readStream: fs.ReadStream | undefined;

    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      const header = buffer.subarray(0, 5).toString();

      if (header !== '%PDF-') {
        throw new Error('Invalid file: only PDF files are supported.');
      }

      fs.writeFileSync(inputPath, buffer);

      this.logger.log(`Original file: ${buffer.length} bytes (~${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);

      const credentials = new ServicePrincipalCredentials({ clientId: this.clientId, clientSecret: this.clientSecret });
      const pdfServices = new PDFServices({ credentials });

      readStream = fs.createReadStream(inputPath);

      const inputAsset = await pdfServices.upload({ readStream, mimeType: MimeType.PDF });
      const job = new CompressPDFJob({ inputAsset, params: { compressionLevel: CompressionLevel[compressionLevel] } });

      const pollingURL = await pdfServices.submit({ job });
      const pdfServicesResponse = await pdfServices.getJobResult({ pollingURL, resultType: CompressPDFResult });

      const resultAsset = pdfServicesResponse?.result?.asset;
      if (!resultAsset) return;

      const streamAsset = await pdfServices.getContent({ asset: resultAsset });
      const outputStream = fs.createWriteStream(outputPath);

      await new Promise<void>((resolve, reject) => {
        streamAsset.readStream.pipe(outputStream);
        streamAsset.readStream.on('end', resolve);
        streamAsset.readStream.on('error', reject);
      });

      const compressedBuffer = fs.readFileSync(outputPath);

      this.logger.log(`Compressed file: ${compressedBuffer.length} bytes (~${(compressedBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

      fs.rmSync(inputPath, { force: true });
      fs.rmSync(outputPath, { force: true });

      return compressedBuffer.toString('base64');
    } catch (err) {
      fs.rmSync(inputPath, { force: true });
      fs.rmSync(outputPath, { force: true });

      if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
        throw new Error('Compression tool error, please contact an administrator.');
      }

      throw new Error('Internal error, please try again in a few moments.');
    } finally {
      readStream?.destroy();
    }
  }
}
