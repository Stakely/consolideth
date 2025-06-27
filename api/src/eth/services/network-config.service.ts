import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EthConfig } from '../config/eth-config.type';

export interface NetworkConfig {
  consolidationContractAddress: string;
  beaconchainApiKey?: string;
  beaconChainApiUrl: string;
  beaconApiUrl: string;
  rateLimits: {
    perSecond: number;
    perMinute: number;
  };
}

@Injectable()
export class NetworkConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Gets network configuration based on network name
   * @param network The network name (mainnet, hoodi)
   */
  public getNetworkConfig(network: string): NetworkConfig {
    const normalizedNetwork = network.toLowerCase();

    if (!['mainnet', 'hoodi'].includes(normalizedNetwork)) {
      throw new Error(
        `Invalid network: ${network}. Supported networks: mainnet, hoodi`,
      );
    }

    const config = this.configService.get('eth', { infer: true }) as EthConfig;

    // Get beacon chain API URLs
    let beaconChainApiUrl: string;
    let beaconApiUrl: string;

    switch (normalizedNetwork) {
      case 'mainnet':
        beaconChainApiUrl = 'https://beaconcha.in/api/v1';
        beaconApiUrl =
          'https://ethereum-beacon-api.publicnode.com/eth/v1/config/spec';
        break;
      case 'hoodi':
        beaconChainApiUrl = 'https://hoodi.beaconcha.in/api/v1';
        beaconApiUrl =
          'https://ethereum-hoodi-beacon-api.publicnode.com/eth/v1/config/spec';
        break;
      default:
        beaconChainApiUrl = 'https://beaconcha.in/api/v1';
        beaconApiUrl =
          'https://ethereum-beacon-api.publicnode.com/eth/v1/config/spec';
        break;
    }

    return {
      consolidationContractAddress:
        config.contracts[normalizedNetwork].consolidation,
      beaconchainApiKey: config.beaconchain.apiKey,
      beaconChainApiUrl,
      beaconApiUrl,
      rateLimits: config.beaconchain.rateLimits,
    };
  }

  /**
   * Get beacon chain API configuration
   * @returns Beacon chain API configuration
   */
  getBeaconChainConfig() {
    return {
      apiKey: this.configService.get('eth.beaconchain.apiKey', { infer: true }),
      rateLimits: {
        perSecond:
          this.configService.get('eth.beaconchain.rateLimits.perSecond', {
            infer: true,
          }) || 2,
        perMinute:
          this.configService.get('eth.beaconchain.rateLimits.perMinute', {
            infer: true,
          }) || 100,
      },
    };
  }

  /**
   * Validates if a network is supported
   * @param network The network name to validate
   */
  public isNetworkSupported(network: string): boolean {
    const normalizedNetwork = network.toLowerCase();
    return ['mainnet', 'hoodi'].includes(normalizedNetwork);
  }
}
