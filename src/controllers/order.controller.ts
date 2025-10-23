import type { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { BaseController } from './base.controller';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class OrderController extends BaseController {
  static async getAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.json(orders);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener pedidos');
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const order = await BaseController.handleNotFound(
        res,
        () => OrderService.getOrderById(validation.parsedId!),
        ERROR_MESSAGES.ORDER_NOT_FOUND
      );

      if (!order) return; // Response already sent
      return res.json(order);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener pedido');
    }
  }

  static async getOrdersByClient(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.clienteId);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'ID de cliente inválido' });
      }

      const orders = await OrderService.getOrdersByClientId(validation.parsedId!);
      return res.json(orders);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener pedidos del cliente');
    }
  }

  static async getOrdersByProduct(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.productoId);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'ID de producto inválido' });
      }

      const orders = await OrderService.getOrdersByProductId(validation.parsedId!);
      return res.json(orders);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener pedidos del producto');
    }
  }

  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      }

      const order = await OrderService.createOrder(req.body, req.user.userId);
      return res.status(HTTP_STATUS.CREATED).json(order);
    } catch (err: any) {
      const statusCode = err.message.includes('Stock insuficiente') || err.message.includes('no encontrado') ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return BaseController.handleError(res, err, 'Error al crear pedido', statusCode);
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const order = await BaseController.handleNotFound(
        res,
        () => OrderService.updateOrderStatus(validation.parsedId!, req.body),
        ERROR_MESSAGES.ORDER_NOT_FOUND
      );

      if (!order) return; // Response already sent
      return res.json(order);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al actualizar estado del pedido');
    }
  }
}
