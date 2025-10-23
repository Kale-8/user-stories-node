import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PedidoProductoAttributes {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PedidoProductoCreationAttributes = Optional<PedidoProductoAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class PedidoProducto extends Model<PedidoProductoAttributes, PedidoProductoCreationAttributes> implements PedidoProductoAttributes {
  public id!: number;
  public pedidoId!: number;
  public productoId!: number;
  public cantidad!: number;
  public precioUnitario!: number;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PedidoProducto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedidoId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    precioUnitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  },
  { sequelize, tableName: 'pedido_productos' }
);
