import express from 'express';
import Wallet from '../models/User';
import { recordDeposit, verifyAndSign } from '../services/ethereumService';

const router = express.Router();

router.post('/sign-spend', async (req, res) => {
  try {
    const { userAddress, nonce, amount, chainId, serviceAddress, userSig, timestamp } = req.body;
    const data = await verifyAndSign(userAddress, nonce, amount, chainId, serviceAddress, userSig, timestamp);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/deposit', async (req, res) => {
  try {
    const { userAddress, amount, chainId } = req.body;
    console.log("Im here");
    const data = await recordDeposit(userAddress, amount, chainId);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

