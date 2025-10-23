import { Pedido, PedidoProducto, Producto, Cliente, Usuario } from '../models';
import { Transaction } from 'sequelize';
import { sequelize } from '../config/database';

export interface CreateOrderDTO {
  clienteId: number;
  vendedorId: number;
  productos: Array<{
    productoId: number;
    cantidad: number;
  }>;
}

export interface OrderWithProducts {
  id: number;
  clienteId: number;
  vendedorId: number;
  total: number;
  estado: string;
  fechaPedido: Date;
  cliente: {
    id: number;
    nombre: string;
    email: string;
  };
  vendedor: {
    id: number;
    nombre: string;
    email: string;
  };
  productos: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      codigo: string;
      nombre: string;
    };
  }>;
}

export class OrderDAO {
  static async findAll(): Promise<OrderWithProducts[]> {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PedidoProducto,
          as: 'pedidoProductos',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ],
      order: [['fechaPedido', 'DESC']]
    });

    return pedidos.map(this.mapToOrderWithProducts);
  }

  static async findById(id: number): Promise<OrderWithProducts | null> {
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PedidoProducto,
          as: 'pedidoProductos',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ]
    });

    return pedido ? this.mapToOrderWithProducts(pedido) : null;
  }

  static async findByClientId(clienteId: number): Promise<OrderWithProducts[]> {
    const pedidos = await Pedido.findAll({
      where: { clienteId },
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PedidoProducto,
          as: 'pedidoProductos',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ],
      order: [['fechaPedido', 'DESC']]
    });

    return pedidos.map(this.mapToOrderWithProducts);
  }

  static async findByProductId(productoId: number): Promise<OrderWithProducts[]> {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PedidoProducto,
          as: 'pedidoProductos',
          where: { productoId },
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ],
      order: [['fechaPedido', 'DESC']]
    });

    return pedidos.map(this.mapToOrderWithProducts);
  }

  static async create(data: CreateOrderDTO): Promise<OrderWithProducts> {
    return sequelize.transaction(async (transaction: Transaction) => {
      // Calculate total
      let total = 0;
      const productosConPrecios = [];

      for (const item of data.productos) {
        const producto = await Producto.findByPk(item.productoId, { transaction });
        if (!producto) {
          throw new Error(`Producto con ID ${item.productoId} no encontrado`);
        }
        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
        }

        const subtotal = parseFloat(producto.precio.toString()) * item.cantidad;
        total += subtotal;

        productosConPrecios.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: parseFloat(producto.precio.toString()),
          subtotal
        });
      }

      // Create order
      const pedido = await Pedido.create({
        clienteId: data.clienteId,
        vendedorId: data.vendedorId,
        total,
        estado: 'pendiente',
        fechaPedido: new Date()
      }, { transaction });

      // Create order products and reduce stock
      for (const item of productosConPrecios) {
        await PedidoProducto.create({
          pedidoId: pedido.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.subtotal
        }, { transaction });

        // Reduce stock
        await Producto.decrement('stock', {
          by: item.cantidad,
          where: { id: item.productoId },
          transaction
        });
      }

      // Return the created order with all relations
      const createdOrder = await Pedido.findByPk(pedido.id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: Usuario,
            as: 'vendedor',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: PedidoProducto,
            as: 'pedidoProductos',
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['id', 'codigo', 'nombre']
              }
            ]
          }
        ],
        transaction
      });

      if (!createdOrder) {
        throw new Error('Error al crear el pedido');
      }

      return this.mapToOrderWithProducts(createdOrder);
    });
  }

  static async updateStatus(id: number, estado: string): Promise<OrderWithProducts | null> {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return null;
    }

    await pedido.update({ estado: estado as any });
    return this.findById(id);
  }

  private static mapToOrderWithProducts(pedido: any): OrderWithProducts {
    return {
      id: pedido.id,
      clienteId: pedido.clienteId,
      vendedorId: pedido.vendedorId,
      total: parseFloat(pedido.total.toString()),
      estado: pedido.estado,
      fechaPedido: pedido.fechaPedido,
      cliente: {
        id: pedido.cliente.id,
        nombre: pedido.cliente.nombre,
        email: pedido.cliente.email
      },
      vendedor: {
        id: pedido.vendedor.id,
        nombre: pedido.vendedor.nombre,
        email: pedido.vendedor.email
      },
      productos: (pedido.pedidoProductos || []).map((pp: any) => ({
        id: pp.id,
        cantidad: pp.cantidad,
        precioUnitario: parseFloat(pp.precioUnitario.toString()),
        subtotal: parseFloat(pp.subtotal.toString()),
        producto: {
          id: pp.producto.id,
          codigo: pp.producto.codigo,
          nombre: pp.producto.nombre
        }
      }))
    };
  }
}
