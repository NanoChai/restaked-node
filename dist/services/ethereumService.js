"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndSign = verifyAndSign;
exports.recordDeposit = recordDeposit;
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const exportAbi_1 = require("../abi/exportAbi");
dotenv_1.default.config();
// Add SSL configuration for the provider
const providerOptions = {
    timeout: 30000, // 30 seconds
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    https: true
};
// Create a new connection config
const connection = {
    url: process.env.BASE_RPC_URL,
    timeout: 30000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
};
// Create a new provider with the connection config
const provider = new ethers_1.ethers.JsonRpcProvider(connection.url, {
    name: 'base',
    chainId: parseInt(process.env.CHAIN_ID || '8453')
});
// Ensure connection is established
provider.getNetwork().then(() => {
    console.log('Successfully connected to Ethereum provider over SSL');
}).catch((error) => {
    console.error('Failed to connect to Ethereum provider:', error);
});
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, exportAbi_1.contractABI, wallet);
function verifyAndSign(userAddress, amount, chainId, serviceAddress, userSig, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verify userSig
            let user = yield User_1.default.findOne({ where: { address: userAddress } });
            if (!user) {
                // Create a new user if it doesn't exist
                return { "status": "user_doesnt_exist", "signature": "" };
            }
            if (!user.services || !Array.isArray(user.services)) {
                user.services = [];
            }
            // Check if the service address already exists
            const existingService = user.services.find(service => service.address === serviceAddress);
            console.log(user.services);
            let nonce;
            console.log(existingService);
            if (existingService) {
                // Increment the nonce if the service address exists
                nonce = existingService.nonce + 1;
                existingService.nonce += 1;
                user.changed("services", true); // Explicitly mark the field as changed
            }
            else {
                // Add a new service if it doesn't exist
                user.services.push({ address: serviceAddress, nonce: 1 });
                nonce = 1;
                user.changed("services", true); // Explicitly mark the field as changed
            }
            // Save changes
            console.log('Before save:', user.services);
            yield user.save();
            console.log('After save:', user.services);
            if (user.amount < Number(amount)) {
                return { "status": "low_balance", "signature": "" };
            }
            user.amount -= Number(amount);
            const message = ethers_1.ethers.solidityPackedKeccak256(['address', 'address', 'string', 'string', 'string'], [serviceAddress, userAddress, amount, nonce.toString(), chainId]);
            const signature = yield wallet.signMessage(message);
            // const signature = await wallet.signMessage(ethers.utils.arrayify(message));
            return { "status": "success", "signature": signature, "nonce": nonce.toString(), "restaker": wallet.address };
        }
        catch (error) {
            console.error('Error in verifyAndSign:', error);
            throw new Error('Failed to verify and sign the message');
        }
    });
}
function recordDeposit(userAddress, amount, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the user from the database
            let user = yield User_1.default.findOne({ where: { address: userAddress } });
            // Fetch the user deposit from the contract
            const userDeposit = yield contract.getDeposits(userAddress);
            if (!user) {
                // Create a new user if it doesn't exist
                user = yield User_1.default.create({
                    address: userAddress,
                });
            }
            else {
                user.amount = Number(userDeposit);
                yield user.save(); // Make sure to save the updated user to persist changes
            }
            return { "status": "updated", "totalDeposit": Number(userDeposit) };
        }
        catch (error) {
            console.error("Error recording deposit:", error);
            // Optionally, rethrow the error if it needs to be handled upstream
            throw error;
        }
    });
}
