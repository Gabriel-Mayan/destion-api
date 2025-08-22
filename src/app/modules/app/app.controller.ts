import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from '@modules/app/app.service';

@Controller()
export class AppController {
  constructor(    private readonly appService: AppService,  ) { }

  @Get('ping')
  async ping(@Req() request: Request) {
    // this.appService.isValidPingRequest(request);

    return { message: 'Ping Ok' };
  }

}
