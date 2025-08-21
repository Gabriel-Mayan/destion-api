import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdobePdfService } from './adobe_pdf.service';

@Module({
  imports: [ConfigModule],
  providers: [AdobePdfService],
  exports: [AdobePdfService],
})
export class AdobePdfModule { }
