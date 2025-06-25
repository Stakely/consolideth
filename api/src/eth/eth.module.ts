import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BeaconChainService } from './services/beacon-chain.service';
import { Web3Service } from './services/web3.service';
import { NetworkConfigService } from './services/network-config.service';
import { EthController } from './controllers/eth.controller';
import ethConfig from './config/eth.config';

@Module({
  imports: [ConfigModule.forFeature(ethConfig)],
  controllers: [EthController],
  providers: [NetworkConfigService, BeaconChainService, Web3Service],
  exports: [NetworkConfigService, BeaconChainService, Web3Service],
})
export class EthModule {}
