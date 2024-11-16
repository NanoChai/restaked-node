import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    // const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: '127.0.0.1', // Use IPv4 address explicitly
      port: 5672,
      username: 'nano',
      password: 'manjuMola',
    });
    channel = await connection.createChannel();

    await channel.assertQueue('claimFunds');

    channel.consume('claimFunds', async (msg) => {
      if (msg !== null) {
        console.log('Received update wallets message');
        channel.ack(msg);
      }
    });

    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

export async function scheduleClaimFunds() {
  if (channel) {
    await channel.sendToQueue('claimFunds', Buffer.from('update'));
    console.log('Wallet update scheduled');
  }
}