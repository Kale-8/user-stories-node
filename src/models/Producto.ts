import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductoAttributes {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductoCreationAttributes = Optional<ProductoAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Producto extends Model<ProductoAttributes, ProductoCreationAttributes> implements ProductoAttributes {
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public precio!: number;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Producto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { sequelize, tableName: 'productos' }
);
