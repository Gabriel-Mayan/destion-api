import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdobePdfService } from '@integrations/adobe_pdf/adobe_pdf.service';
import { CompressionService } from '@infrastructure/compressors/compressor.service';

@Module({
  imports: [ConfigModule],
  providers: [CompressionService, AdobePdfService],
  exports: [CompressionService],
})
export class CompressorsModule {}
