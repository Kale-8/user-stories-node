import { OrderDAO, CreateOrderDTO, OrderWithProducts } from '../dao/order.dao';
import { OrderResponseDTO, UpdateOrderStatusDTO } from '../dto/order.dto';

export class OrderService {
  static async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findAll();
    return orders.map(this.mapToResponseDTO);
  }

  static async getOrderById(id: number): Promise<OrderResponseDTO | null> {
    const order = await OrderDAO.findById(id);
    return order ? this.mapToResponseDTO(order) : null;
  }

  static async getOrdersByClientId(clienteId: number): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findByClientId(clienteId);
    return orders.map(this.mapToResponseDTO);
  }

  static async getOrdersByProductId(productoId: number): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findByProductId(productoId);
    return orders.map(this.mapToResponseDTO);
  }

  static async createOrder(data: CreateOrderDTO, vendedorId: number): Promise<OrderResponseDTO> {
    const orderData = {
      ...data,
      vendedorId
    };
    
    const order = await OrderDAO.create(orderData);
    return this.mapToResponseDTO(order);
  }

  static async updateOrderStatus(id: number, data: UpdateOrderStatusDTO): Promise<OrderResponseDTO | null> {
    const order = await OrderDAO.updateStatus(id, data.estado);
    return order ? this.mapToResponseDTO(order) : null;
  }

  private static mapToResponseDTO(order: OrderWithProducts): OrderResponseDTO {
    return {
      id: order.id,
      clienteId: order.clienteId,
      vendedorId: order.vendedorId,
      total: order.total,
      estado: order.estado,
      fechaPedido: order.fechaPedido,
      cliente: order.cliente,
      vendedor: order.vendedor,
      productos: order.productos
    };
  }
}
