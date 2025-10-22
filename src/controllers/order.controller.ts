import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class OrderController {
  static async getAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.json(orders);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener pedidos' });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const order = await OrderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      return res.json(order);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener pedido' });
    }
  }

  static async getOrdersByClient(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.clienteId);
      if (isNaN(clienteId)) {
        return res.status(400).json({ message: 'ID de cliente inválido' });
      }

      const orders = await OrderService.getOrdersByClientId(clienteId);
      return res.json(orders);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener pedidos del cliente' });
    }
  }

  static async getOrdersByProduct(req: Request, res: Response) {
    try {
      const productoId = parseInt(req.params.productoId);
      if (isNaN(productoId)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
      }

      const orders = await OrderService.getOrdersByProductId(productoId);
      return res.json(orders);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener pedidos del producto' });
    }
  }

  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      const order = await OrderService.createOrder(req.body, req.user.userId);
      return res.status(201).json(order);
    } catch (err: any) {
      if (err.message.includes('Stock insuficiente') || err.message.includes('no encontrado')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message || 'Error al crear pedido' });
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const order = await OrderService.updateOrderStatus(id, req.body);
      if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      return res.json(order);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al actualizar estado del pedido' });
    }
  }
}
