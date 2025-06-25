# ConsolidETH

A full-stack application for Ethereum validator consolidation, built with NestJS API backend and React frontend.

## 🏗️ Architecture

This is a monorepo containing:

- **`/api`** - NestJS backend API for Ethereum validator consolidation
- **`/frontend`** - React frontend application built with Vite

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Yarn (for frontend development)

### Running with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd consolideth
   ```

2. **Copy environment files**
   ```bash
   # API environment
   cp api/env-example-relational api/.env
   
   # Frontend environment  
   cp frontend/env-example frontend/.env
   
   # Root environment for Docker Compose
   cp .env.example .env
   ```

3. **Configure environment variables**
   Edit the `.env` files with your specific configuration:
   - Set your Ethereum RPC URLs
   - Configure contract addresses
   - Add your BeaconChain API key

4. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - **Frontend**: http://localhost:4000
   - **API**: http://localhost:3000

### Local Development

#### API Development

```bash
cd api
npm install
npm run start:dev
```

#### Frontend Development

```bash
cd frontend
yarn install
yarn dev
```

## 📖 API Documentation

### Network Configuration

The API accepts network configuration via request headers. Each request must include the `x-network` header:

- `mainnet` - Ethereum mainnet
- `hoodi` - Hoodi testnet

### Key Endpoints

#### GET /api/v1/eth/validators
Retrieves validators for specific withdrawal credentials with consolidation status.

**Headers:**
- `x-network` (required): The Ethereum network (mainnet, hoodi)

**Query Parameters:**
- `withdrawalCredentials` (optional): Withdrawal credentials or ETH1 address

**Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/eth/validators?withdrawalCredentials=0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f" \
  -H "x-network: mainnet"
```

#### POST /api/v1/eth/consolidate
Generate transaction payloads for validator consolidation.

**Headers:**
- `x-network` (required): The Ethereum network (mainnet, hoodi)

**Request Body:**
```json
{
  "targetPubkey": "0xb99f1a828ef05a6004c8ad6d4ce34a0fcec337019ad73a9a8e7fdd031244607a88353363023f3d1baa05bc03b3b795f6",
  "sourcePubkeys": [
    "0x88a0495e5e25e230efd29a17def3a231c1e79ac479df2b63024759293bfcca4ae12a8d777735811ede09834293e8a6d8"
  ],
  "sender": "0x5fDCb78cA9A1164c13428E5fC9582c8c48Dab69f"
}
```

#### POST /api/v1/eth/execute-consolidation
Execute consolidation transactions for validators.

## 🎨 Frontend Features

The frontend provides a user-friendly interface for:

- Connecting wallets via RainbowKit
- Viewing validator information
- Preparing consolidation transactions
- Executing consolidations through connected wallets

### Frontend Scripts

- `yarn dev` - Start development server with HMR
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn cs:check` - Check coding style (Prettier + ESLint)
- `yarn cs:fix` - Auto-fix coding style issues

## ⚙️ Configuration

### Environment Variables

#### Root `.env` (for Docker Compose)
```bash
# Application Ports
APP_PORT=3000
FRONTEND_PORT=4000

# Network
NETWORK_NAME=consolideth-network
```

#### API Environment (`api/.env`)
```bash
# Application
NODE_ENV=development
APP_PORT=3000
APP_NAME="Consolideth API"

# Ethereum Networks
ETH_RPC_URL_MAINNET=https://ethereum-rpc.publicnode.com
ETH_RPC_URL_HOODI=https://ethereum-hoodi-rpc.publicnode.com

# Contract Addresses
CONSOLIDATION_MAINNET_CONTRACT_ADDRESS=0x0000BBdDc7CE488642fb579F8B00f3a590007251
CONSOLIDATION_HOODI_CONTRACT_ADDRESS=0x0000BBdDc7CE488642fb579F8B00f3a590007251

# BeaconChain API
BEACONCHAIN_API_KEY=your_beaconchain_api_key
RATE_LIMIT_PER_SECOND=5
RATE_LIMIT_PER_MINUTE=20

# Monitoring
SENTRY_DSN=https://xxxxxxxxxxxxxxxxx.ingest.de.sentry.io/yyyyyyyyyyyyyy
SENTRY_ENABLED=false
```

#### Frontend Environment (`frontend/.env`)
```bash
VITE_WALLET_CONNECT_PROJECT_ID="your_wallet_connect_project_id"
VITE_UMAMI_PROJECT_ID="your_umami_project_id"
VITE_API_URL="http://localhost:3000"
VITE_EXPLORER_URL="https://beaconcha.in/tx"
VITE_HOODI_EXPLORER_URL="https://hoodi.beaconcha.in/tx"
VITE_GITHUB_REPOSITORY="https://github.com/yourusername/consolideth"
```

## 🔧 Development

### Project Structure
```
consolideth/
├── api/                    # NestJS backend
│   ├── src/
│   ├── Dockerfile
│   └── env-example-relational
├── frontend/               # React frontend
│   ├── src/
│   ├── Dockerfile
│   └── env-example
├── docker-compose.yaml     # Combined services
└── README.md              # This file
```

### API Configuration Details

The ETH module provides structured configuration with:
- **Network-specific RPC URLs**: Support for multiple Ethereum networks
- **Contract addresses**: Network-specific consolidation contract addresses  
- **BeaconChain integration**: API configuration with rate limiting
- **Dynamic network selection**: Runtime network switching via headers

### Frontend Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Material-UI** for component library
- **RainbowKit** for wallet connections
- **TanStack Query** for data fetching
- **Wagmi** for Ethereum interactions

## 🐳 Docker Services

The `docker-compose.yaml` includes:

1. **consolideth-frontend**: React app served by Nginx (port 4000)
2. **consolideth-api**: NestJS API server (port 3000)

Both services are connected via a custom Docker network with proper health checks and dependencies.

## 📝 API Documentation

Full API documentation is available via Swagger UI when running the API:
- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost:3000/api/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.