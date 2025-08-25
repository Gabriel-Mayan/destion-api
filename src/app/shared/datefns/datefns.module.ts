import { Module } from '@nestjs/common';
import { DateFnsService } from './datefns.service';

@Module({
  providers: [DateFnsService],
  exports: [DateFnsService],
})
export class DateFnsModule {}
