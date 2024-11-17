# Restaked Node

A Node.js backend service for managing staking operations and signature verification for the Base network. This service handles user deposits, signature verification, and restaking operations through a secure HTTPS API.





## Features

- Secure HTTPS endpoints for staking operations
- User deposit management and verification
- Signature verification for spend operations
- SQLite database integration for user data persistence
- RabbitMQ integration for asynchronous operations
- CORS support for cross-origin requests
- Base network integration using ethers.js

## Prerequisites

- Node.js (v14 or higher)
- SQLite3
- RabbitMQ
- SSL certificates (for HTTPS)
- Base network RPC access

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/restaked-node.git
   cd restaked-node
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/database_name
   RABBITMQ_URL=amqp://localhost
   BASE_RPC_URL=your_base_rpc_url
   ```

4. Set up the database:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Generate SSL certificates:
   Place your SSL certificate and key files in the `certs` directory:
   - `certs/server.cert`
   - `certs/server.key`
