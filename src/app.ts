import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import apiRoutes from './routes/api';
import { connectRabbitMQ, scheduleClaimFunds } from './services/rabbitmqService';

const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', apiRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Schedule initial wallet update
    // await scheduleClaimFunds();

    // Schedule wallet update every hour
    // setInterval(scheduleClaimFunds, 30 * 1000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();