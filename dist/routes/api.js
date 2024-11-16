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
const express_1 = __importDefault(require("express"));
const ethereumService_1 = require("../services/ethereumService");
const router = express_1.default.Router();
router.post('/sign-spend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, amount, chainId, serviceAddress, userSig, timestamp } = req.body;
        const data = yield (0, ethereumService_1.verifyAndSign)(userAddress, amount, chainId, serviceAddress, userSig, timestamp);
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
router.post('/deposit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, amount, chainId } = req.body;
        console.log("Im here");
        const data = yield (0, ethereumService_1.recordDeposit)(userAddress, amount, chainId);
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
