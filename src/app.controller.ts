import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Sign } from './DTO/sign'
import { Request } from 'express';
import {recoverTypedSignature as recoverTypedSignatureV4, SignTypedDataVersion,
} from '@metamask/eth-sig-util';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  validateSign(@Body() _sign: Sign): Sign{
    const recoveredAddr = recoverTypedSignatureV4({
      data: msgParams,
      signature: '0xddf5be2817a220c350778b23784b2d5eca7f2dd63c07b95f7572756db69d20456c02f68ec27d705f231a2904915d0be26f5d2d94715ca71263da11b8b17975ff1b',
      version:SignTypedDataVersion.V4  
  });
    return _sign;
  }
}
