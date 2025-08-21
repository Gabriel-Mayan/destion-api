import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AdobePdfService } from '@integrations/adobe_pdf/adobe_pdf.service';

type CompressType = 'PDF' | 'JPG';
export type CompressionLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface CompressOptions {
  compressionLevel?: CompressionLevel;
  fileBase64: string;
}

@Injectable()
export class CompressionService {
  public maxFileSize: number;
  public compressionList: ["PDF"];
  
  public filesSignatures: { PDF: 'JVBERi0', JPG: '/9j/' };

  private compressors: Partial<Record<CompressType, (options: CompressOptions) => Promise<string>>>;

  constructor(private readonly adobePdfService: AdobePdfService, private config: ConfigService,) {
    this.maxFileSize = parseInt(this.config.get<string>('MAX_FILE_SIZE')!, 10);
    this.compressors = { PDF: this.adobePdfService.compressPdf.bind(this.adobePdfService) };
  }

  async compress(type: CompressType, options: CompressOptions) {
    const compressor = this.compressors[type];

    if (!compressor)
      throw new Error(`Compressor não implementado para tipo: ${type}`);

    return compressor(options);
  }
}
