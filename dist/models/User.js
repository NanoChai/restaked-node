"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
    ;
}
User.init({
    address: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    services: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    modelName: 'User',
});
exports.default = User;
