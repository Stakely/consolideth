import { registerAs } from '@nestjs/config';
import { EthConfig } from './eth-config.type';
import validateConfig from '../../utils/validate-config';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  ETH_RPC_URL_MAINNET: string;

  @IsString()
  ETH_RPC_URL_HOODI: string;

  @IsString()
  @IsOptional()
  CONSOLIDATION_MAINNET_CONTRACT_ADDRESS: string;

  @IsString()
  @IsOptional()
  CONSOLIDATION_HOODI_CONTRACT_ADDRESS: string;

  @IsString()
  @IsOptional()
  BEACONCHAIN_API_KEY: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  RATE_LIMIT_PER_SECOND: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  RATE_LIMIT_PER_MINUTE: number;
}

export default registerAs<EthConfig>('eth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  if (!process.env.ETH_RPC_URL_MAINNET) {
    throw new Error('ETH_RPC_URL_MAINNET is not set');
  }
  if (!process.env.ETH_RPC_URL_HOODI) {
    throw new Error('ETH_RPC_URL_HOODI is not set');
  }

  return {
    rpcUrls: {
      mainnet: process.env.ETH_RPC_URL_MAINNET,
      hoodi: process.env.ETH_RPC_URL_HOODI,
    },
    contracts: {
      mainnet: {
        consolidation: process.env.CONSOLIDATION_MAINNET_CONTRACT_ADDRESS ?? '',
      },
      hoodi: {
        consolidation: process.env.CONSOLIDATION_HOODI_CONTRACT_ADDRESS ?? '',
      },
    },
    beaconchain: {
      apiKey: process.env.BEACONCHAIN_API_KEY,
      rateLimits: {
        perSecond: parseInt(process.env.RATE_LIMIT_PER_SECOND || '2', 10),
        perMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '100', 10),
      },
    },
  };
});
