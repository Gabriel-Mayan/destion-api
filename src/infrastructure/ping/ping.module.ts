import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { HttpModule } from '@shared/http/http.module';

import { PingService } from './ping.service';

@Module({
  imports: [ConfigModule, HttpModule, ScheduleModule.forRoot(),],
  providers: [PingService],
})

export class PingModule { }
