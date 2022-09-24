import { Module,CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from 'nest-web3';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.development.env',
    isGlobal: true
  }),CacheModule.register(),
  Web3Module.forRoot({
    name: 'eth',
    url: 'https://soft-tiniest-frog.matic-testnet.discover.quiknode.pro/dc72e305646d4ac8cf9349c19851b327d972b8ac/',
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
