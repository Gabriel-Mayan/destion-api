import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }

  isValidPingRequest(request: Request) {
    const internalKey = request.headers['x-internal-key'];

    if (internalKey !== this.config.get<string>('INTERNAL_KEY')) {
      throw new ForbiddenException();
    }
  }
}
