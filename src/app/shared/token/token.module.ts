import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TokenService } from './token.service';
import { tokenConfig } from './token.config';

@Module({
  imports: [
    ConfigModule, 
    JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: tokenConfig })
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule { }
