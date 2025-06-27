# ConsolidETH API

NestJS API for Ethereum validator consolidation.

## ETH Module

The ETH module provides endpoints for working with Ethereum validators and beacon chain consolidation.

### Network Configuration

The API now accepts the network configuration via request headers instead of environment variables. Each request must include the `x-network` header with one of the supported networks:

- `mainnet` - Ethereum mainnet
- `hoodi` - Hoodi testnet  

### Endpoints

#### GET /eth/validators

Retrieves all validators for a specific withdrawal credentials, and provides information about their consolidation status.

**Headers:**
- `x-network` (required): The Ethereum network (mainnet, hoodi)

**Query Parameters:**
- `withdrawalCredentials` (optional): The withdrawal credentials or ETH1 address to fetch validators for

If not provided, it will use the owner address from configuration.

**Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/eth/validators?withdrawalCredentials=0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f" \
  -H "x-network: mainnet"
```

#### POST /eth/consolidate

Generate transaction payloads for consolidating validators without executing them.

**Headers:**
- `x-network` (required): The Ethereum network (mainnet, hoodi)

**Request Body:**
```json
{
  "targetPubkey": "0xb99f1a828ef05a6004c8ad6d4ce34a0fcec337019ad73a9a8e7fdd031244607a88353363023f3d1baa05bc03b3b795f6",
  "sourcePubkeys": [
    "0x88a0495e5e25e230efd29a17def3a231c1e79ac479df2b63024759293bfcca4ae12a8d777735811ede09834293e8a6d8",
    "0xac62e3b58fcad55d6f1624bb07c724a61595cc2c6122c3333640c2e2d77daef43d0175fd8b0f18ca982e8886cc705322"
  ],
  "sender": "0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/eth/consolidate" \
  -H "Content-Type: application/json" \
  -H "x-network: mainnet" \
  -d '{
    "targetPubkey": "0xb99f1a828ef05a6004c8ad6d4ce34a0fcec337019ad73a9a8e7fdd031244607a88353363023f3d1baa05bc03b3b795f6",
    "sourcePubkeys": [
      "0x88a0495e5e25e230efd29a17def3a231c1e79ac479df2b63024759293bfcca4ae12a8d777735811ede09834293e8a6d8"
    ],
    "sender": "0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f"
  }'
```

#### POST /eth/execute-consolidation

Execute consolidation transactions for the provided target and source validators.

**Headers:**
- `x-network` (required): The Ethereum network (mainnet, hoodi)

**Request Body:**
```json
{
  "targetPubkey": "0xb99f1a828ef05a6004c8ad6d4ce34a0fcec337019ad73a9a8e7fdd031244607a88353363023f3d1baa05bc03b3b795f6",
  "sourcePubkeys": [
    "0x88a0495e5e25e230efd29a17def3a231c1e79ac479df2b63024759293bfcca4ae12a8d777735811ede09834293e8a6d8",
    "0xac62e3b58fcad55d6f1624bb07c724a61595cc2c6122c3333640c2e2d77daef43d0175fd8b0f18ca982e8886cc705322"
  ],
  "sender": "0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f"
}
```

### Environment Variables

The module requires the following environment variables:

```
# Ethereum
ETH_RPC_URL_MAINNET=https://eth-mainnet.provider.com
ETH_RPC_URL_HOODI=https://eth-hoodi.provider.com

# Contract Addresses
CONSOLIDATION_MAINNET_CONTRACT_ADDRESS=0x...
CONSOLIDATION_HOODI_CONTRACT_ADDRESS=0x...

# Beacon Chain API
BEACONCHAIN_API_KEY=your_beaconchain_api_key
RATE_LIMIT_PER_SECOND=2
RATE_LIMIT_PER_MINUTE=100
```

### Configuration

The ETH module provides a structured configuration using NestJS's ConfigModule. The configuration includes:

- `eth.rpcUrl`: The RPC URL for connecting to the Ethereum network
- `eth.contracts`: Network-specific contract addresses for consolidation
- `eth.beaconchain`: Beacon Chain API configuration including API key and rate limits

The network-specific configuration is now handled dynamically based on the `x-network` header in each request, allowing the same API instance to serve multiple networks.

The configuration is validated at application startup to ensure all required values are provided.