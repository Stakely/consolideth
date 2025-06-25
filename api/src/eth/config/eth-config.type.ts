export type EthConfig = {
  network: string;
  rpcUrls: {
    mainnet: string;
    hoodi: string;
  };
  contracts: {
    mainnet: {
      consolidation: string;
    };
    hoodi: {
      consolidation: string;
    };
  };
  beaconchain: {
    apiKey?: string;
    rateLimits: {
      perSecond: number;
      perMinute: number;
    };
  };
};
