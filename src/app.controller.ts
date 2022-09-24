import { Body, Controller, Get, Post, Inject, CACHE_MANAGER, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Sign } from './DTO/sign';
import {
  recoverTypedSignature as recoverTypedSignatureV4, SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { Web3Service } from "nest-web3";

import { MsgParam } from 'src/DTO/msgParam'
import { Cache } from 'cache-manager';
import { ConfigService } from "@nestjs/config";
@Controller('sign')
export class AppController {
  web3Provider: any
  web3: any
  constructor(private readonly appService: AppService, @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService, private readonly web3Service: Web3Service) {

  }

  @Get()
  async getHello(): Promise<number> {
    const client = this.web3Service.getClient('eth'); // we are give name of client in config file
    return await client.eth.getChainId();
    //return this.appService.getHello();
  }

  @Get(':address')
  async getNonce(@Param('address') _address: string): Promise<any> {
    let rndNumber = Math.floor(Math.random() * 100000);


    try {
      const client = this.web3Service.getClient('eth');
      const address = await client.utils.toChecksumAddress(_address);//this.web3.utils.toChecksumAddress(_address)
      await this.cacheManager.set(_address.trim(), rndNumber, { ttl: 3600 }); //one hour
      let value = await this.cacheManager.get(_address);
      console.log(value);
      return rndNumber;
    } catch (e) {
      console.error('invalid ethereum address', e.message)
      return "error";
    }

  }

  @Post()
  async validateSign(@Body() _sign: Sign): Promise<any> {

    try {
      let value = await this.cacheManager.get(_sign.address.trim());
      console.log(typeof _sign.address);
      console.log(_sign.sign);
      console.log("Value" + value);
      const client = this.web3Service.getClient('eth');

      const recoveredAddr = recoverTypedSignatureV4({
        data: new MsgParam().getMsgParam(value.toString()),
        signature: _sign.sign,
        version: SignTypedDataVersion.V4
      });
      console.log(recoveredAddr);
      let recoverAdd = await client.utils.toChecksumAddress(recoveredAddr);
      console.log("Recoverad " + recoverAdd);
      let address = await client.utils.toChecksumAddress(_sign.address.trim());
      console.log("Address parameter " + address);
      if (recoverAdd == address) {
        //la firma es valida
        console.log("La firma es valida");
        //aca viene la creacion del JWT
        return true;
      } else {
        console.log("La firma es invalida")
        return false;
      }
    } catch (Error: any) {
      console.log("Hubo un erro1r: " + Error);
      return false;
    }


    //console.log(_sign.address);
    //console.log(_sign.sign);
    /*  let msgParam =new MsgParam().getMsgParam("343");
       return msgParam;  */
    // return JSON.stringify(recoveredAddr);
  }
}

