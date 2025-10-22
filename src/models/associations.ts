import { Pedido } from './Pedido';
import { PedidoProducto } from './PedidoProducto';
import { Producto } from './Producto';
import { Cliente } from './Cliente';
import { Usuario } from './Usuario';

// Define associations
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Pedido.belongsTo(Usuario, { foreignKey: 'vendedorId', as: 'vendedor' });

Pedido.belongsToMany(Producto, { 
  through: PedidoProducto, 
  foreignKey: 'pedidoId',
  otherKey: 'productoId',
  as: 'productos'
});

Producto.belongsToMany(Pedido, { 
  through: PedidoProducto, 
  foreignKey: 'productoId',
  otherKey: 'pedidoId',
  as: 'pedidos'
});

PedidoProducto.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });
PedidoProducto.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

Cliente.hasMany(Pedido, { foreignKey: 'clienteId', as: 'pedidos' });
Usuario.hasMany(Pedido, { foreignKey: 'vendedorId', as: 'pedidosVendidos' });
Producto.hasMany(PedidoProducto, { foreignKey: 'productoId', as: 'pedidoProductos' });
Pedido.hasMany(PedidoProducto, { foreignKey: 'pedidoId', as: 'pedidoProductos' });
