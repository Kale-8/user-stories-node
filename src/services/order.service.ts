import { OrderDAO, CreateOrderDTO, OrderWithProducts } from '../dao/order.dao';
import { OrderResponseDTO, UpdateOrderStatusDTO } from '../dto/order.dto';
import { CryptoUtil } from '../utils/crypto.util';

export class OrderService {
  static async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findAll();
    return orders.map(order => this.mapToResponseDTO(this.decryptOrderData(order)));
  }

  static async getOrderById(id: number): Promise<OrderResponseDTO | null> {
    const order = await OrderDAO.findById(id);
    return order ? this.mapToResponseDTO(this.decryptOrderData(order)) : null;
  }

  static async getOrdersByClientId(clienteId: number): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findByClientId(clienteId);
    return orders.map(order => this.mapToResponseDTO(this.decryptOrderData(order)));
  }

  static async getOrdersByProductId(productoId: number): Promise<OrderResponseDTO[]> {
    const orders = await OrderDAO.findByProductId(productoId);
    return orders.map(order => this.mapToResponseDTO(this.decryptOrderData(order)));
  }

  static async createOrder(data: CreateOrderDTO, vendedorId: number): Promise<OrderResponseDTO> {
    const orderData = {
      ...data,
      vendedorId
    };
    
    const order = await OrderDAO.create(orderData);
    return this.mapToResponseDTO(this.decryptOrderData(order));
  }

  static async updateOrderStatus(id: number, data: UpdateOrderStatusDTO): Promise<OrderResponseDTO | null> {
    const order = await OrderDAO.updateStatus(id, data.estado);
    return order ? this.mapToResponseDTO(this.decryptOrderData(order)) : null;
  }

  private static encryptOrderData(order: OrderWithProducts): OrderWithProducts {
    try {
      // Encrypt sensitive client information
      const encryptedClientEmail = CryptoUtil.hybridEncrypt(order.cliente.email);
      const encryptedVendedorEmail = CryptoUtil.hybridEncrypt(order.vendedor.email);
      
      return {
        ...order,
        cliente: {
          ...order.cliente,
          email: `encrypted:${encryptedClientEmail.encryptedKey}:${encryptedClientEmail.encryptedData.encrypted}`
        },
        vendedor: {
          ...order.vendedor,
          email: `encrypted:${encryptedVendedorEmail.encryptedKey}:${encryptedVendedorEmail.encryptedData.encrypted}`
        }
      };
    } catch (error) {
      console.error('Error encrypting order data:', error);
      return order; // Return original data if encryption fails
    }
  }

  private static decryptOrderData(order: OrderWithProducts): OrderWithProducts {
    try {
      // Decrypt sensitive client information
      let decryptedClientEmail = order.cliente.email;
      let decryptedVendedorEmail = order.vendedor.email;

      if (order.cliente.email.startsWith('encrypted:')) {
        const [, encryptedKey, encryptedData] = order.cliente.email.split(':');
        decryptedClientEmail = CryptoUtil.hybridDecrypt(encryptedKey, {
          encrypted: encryptedData,
          iv: '', // In real implementation, store IV separately
          tag: '' // In real implementation, store tag separately
        });
      }

      if (order.vendedor.email.startsWith('encrypted:')) {
        const [, encryptedKey, encryptedData] = order.vendedor.email.split(':');
        decryptedVendedorEmail = CryptoUtil.hybridDecrypt(encryptedKey, {
          encrypted: encryptedData,
          iv: '', // In real implementation, store IV separately
          tag: '' // In real implementation, store tag separately
        });
      }

      return {
        ...order,
        cliente: {
          ...order.cliente,
          email: decryptedClientEmail
        },
        vendedor: {
          ...order.vendedor,
          email: decryptedVendedorEmail
        }
      };
    } catch (error) {
      console.error('Error decrypting order data:', error);
      return order; // Return original data if decryption fails
    }
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
