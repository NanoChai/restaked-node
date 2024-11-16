import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import sequelize from './config/database';
import { verifyAndSign, recordDeposit } from './services/ethereumService';

const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'https://website-base-kappa.vercel.app',
    'https://realandbeautiful.online',
    'http://localhost:3000',
    '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.set('trust proxy', true);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.post('/sign-spend', async (req, res) => {
  try {
    const { userAddress, amount, chainId, serviceAddress, userSig, timestamp } = req.body;
    const data = await verifyAndSign(userAddress, amount, chainId, serviceAddress, userSig, timestamp);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/deposit', async (req, res) => {
  try {
    const { userAddress, amount, chainId } = req.body;
    const data = await recordDeposit(userAddress, amount, chainId);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = Number(process.env.PORT) || 3001; // Changed default port to 3001

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    // SSL certificate paths
    const sslOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/realandbeautiful.online/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/realandbeautiful.online/fullchain.pem')
    };

    // Try to create server and handle potential port conflicts
    const server = https.createServer(sslOptions, app);
    
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
        console.error('You can set a different port using the PORT environment variable.');
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`HTTPS Server running on https://realandbeautiful.online:${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();