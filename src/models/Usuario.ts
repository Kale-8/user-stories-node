import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UsuarioAttributes {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: 'admin' | 'vendedor';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UsuarioCreationAttributes = Optional<UsuarioAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public passwordHash!: string;
  public rol!: 'admin' | 'vendedor';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.ENUM('admin', 'vendedor'), allowNull: false },
  },
  { sequelize, tableName: 'usuarios' }
);
