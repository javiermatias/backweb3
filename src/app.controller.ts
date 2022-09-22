import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Sign } from './DTO/sign'
import { Request } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  validateSign(@Body() _sign: Sign): Sign{
    // console.log(req.body);
   // console.log(signDTO.sign);
    return _sign;
  }
}
