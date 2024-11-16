import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public address!: string;
  public services!: Array<{ address: string; nonce: number }>;;
  public amount!: number;
}

User.init(
  {
    address: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    services: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
