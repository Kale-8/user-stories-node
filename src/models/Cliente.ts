import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClienteAttributes {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClienteCreationAttributes = Optional<ClienteAttributes, 'id' | 'telefono' | 'createdAt' | 'updatedAt'>;

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public telefono!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cliente.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
  },
  { sequelize, tableName: 'clientes' }
);
