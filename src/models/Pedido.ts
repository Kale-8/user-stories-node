import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PedidoAttributes {
  id: number;
  clienteId: number;
  vendedorId: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  fechaPedido: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PedidoCreationAttributes = Optional<PedidoAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Pedido extends Model<PedidoAttributes, PedidoCreationAttributes> implements PedidoAttributes {
  public id!: number;
  public clienteId!: number;
  public vendedorId!: number;
  public total!: number;
  public estado!: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  public fechaPedido!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pedido.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
    vendedorId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    estado: { 
      type: DataTypes.ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'), 
      allowNull: false,
      defaultValue: 'pendiente'
    },
    fechaPedido: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'pedidos' }
);
