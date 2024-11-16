import { ethers } from 'ethers';
import dotenv from 'dotenv';
import User from '../models/User';
import {contractABI} from '../abi/exportAbi';

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);


const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractABI, wallet);


export async function verifyAndSign(userAddress: string, amount: string, chainId: string, serviceAddress: string, userSig: string, timestamp: string) {
  try {
    // Verify userSig
    let user = await User.findOne({ where: { address: userAddress } });

    if (!user) {
      // Create a new user if it doesn't exist
      return {"status": "user_doesnt_exist", "signature": ""};
    }
    if (!user.services || !Array.isArray(user.services)) {
      user.services = [];
    }
    // Check if the service address already exists
    const existingService = user.services.find(service => service.address === serviceAddress);
    let nonce;
    console.log(existingService);
    if (existingService) {
      // Increment the nonce if the service address exists
      nonce = existingService.nonce + 1;
      existingService.nonce += 1;
      user.changed("services", true); // Explicitly mark the field as changed
    } else {
      // Add a new service if it doesn't exist
      user.services.push({ address: serviceAddress, nonce: 1 });
      nonce = 1;
      user.changed("services", true); // Explicitly mark the field as changed
    }
    // Save changes
    await user.save();
    console.log(nonce);
    if (user.amount < Number(amount)){
      return {"status": "low_balance", "signature": ""};
    }
    user.amount -= Number(amount);
    
    console.log([serviceAddress, userAddress, amount, nonce.toString(), chainId]);
    
    const message = ethers.utils.solidityKeccak256(
      ['address', 'address', 'string', 'string', 'string'],
      [serviceAddress, userAddress, amount, nonce.toString(), chainId]
    );
    console.log(message);
    
    const signature = await wallet.signMessage(message);
    // const signature = await wallet.signMessage(ethers.utils.arrayify(message));
    return { "status": "success", "signature": signature, "nonce": nonce.toString(), "restaker": wallet.address};
  } catch (error) {
    console.error('Error in verifyAndSign:', error);
    throw new Error('Failed to verify and sign the message');
  }
}

export async function recordDeposit(userAddress: any, amount: any, chainId: any) {
  try {
    // Fetch the user from the database
    let user = await User.findOne({ where: { address: userAddress } });

    // Fetch the user deposit from the contract
    const userDeposit = await contract.getDeposits(userAddress);

    if (!user) {
      // Create a new user if it doesn't exist
      user = await User.create({
        address: userAddress,
      });
    } else {
      user.amount = Number(userDeposit);
      await user.save(); // Make sure to save the updated user to persist changes
    }
    return {"status": "updated", "totalDeposit": Number(userDeposit)};

  } catch (error) {
    console.error("Error recording deposit:", error);
    // Optionally, rethrow the error if it needs to be handled upstream
    throw error;
  }
}
