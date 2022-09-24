import { Body, Controller, Get, Post, Inject, CACHE_MANAGER, Param} from '@nestjs/common';
import { AppService } from './app.service';
import { Sign } from './DTO/sign';
import {recoverTypedSignature as recoverTypedSignatureV4, SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { Web3Service } from "nest-web3";

import {MsgParam} from 'src/DTO/msgParam'
import {Cache} from 'cache-manager';
import { ConfigService } from "@nestjs/config";
@Controller('sign')
export class AppController {
  web3Provider:any
  web3:any
  constructor(private readonly appService: AppService,@Inject(CACHE_MANAGER) private cacheManager: Cache,
  private configService: ConfigService,private readonly web3Service: Web3Service) {
    //this.web3 = new Web3(new Web3.providers.HttpProvider('https://soft-tiniest-frog.matic-testnet.discover.quiknode.pro/dc72e305646d4ac8cf9349c19851b327d972b8ac/'));
    //this.web3Provider = new Web3.providers.HttpProvider(this.configService.get<string>('provider'));
    //this.web3 = new Web3(this.web3Provider);
  }

  @Get()
  async getHello(): Promise<number> {
    const client = this.web3Service.getClient('eth'); // we are give name of client in config file
    return await client.eth.getChainId();
    //return this.appService.getHello();
  }

   @Get(':address')
   async getNonce(@Param('address') _address: string): Promise<any>{
    let rndNumber = Math.floor(Math.random() * 100000);
   
    console.log(_address); 
    try {
      const client = this.web3Service.getClient('eth');
      const address = await client.utils.toChecksumAddress(_address);//this.web3.utils.toChecksumAddress(_address)
      await this.cacheManager.set(address, rndNumber, {ttl: 3600} ); //one hour
      let value = await this.cacheManager.get(address);
      console.log(value);
      return rndNumber;
    } catch(e) { 
      console.error('invalid ethereum address', e.message) 
      return "error";
    }  
    
  }

  @Post()
  validateSign(@Body() _sign: Sign): any{

     const recoveredAddr = recoverTypedSignatureV4({
      data: new MsgParam().getMsgParam("343"),
      signature: '0xddf5be2817a220c350778b23784b2d5eca7f2dd63c07b95f7572756db69d20456c02f68ec27d705f231a2904915d0be26f5d2d94715ca71263da11b8b17975ff1b',
      version:SignTypedDataVersion.V4  
  }); 
 /*  let msgParam =new MsgParam().getMsgParam("343");
    return msgParam;  */
     return recoveredAddr;
  }
}

