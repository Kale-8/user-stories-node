import type { Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { BaseController } from './base.controller';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ClientController extends BaseController {
  static async getAllClients(req: Request, res: Response) {
    try {
      const clients = await ClientService.getAllClients();
      return res.json(clients);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener clientes');
    }
  }

  static async getClientById(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const client = await BaseController.handleNotFound(
        res,
        () => ClientService.getClientById(validation.parsedId!),
        ERROR_MESSAGES.CLIENT_NOT_FOUND
      );

      if (!client) return; // Response already sent
      return res.json(client);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener cliente');
    }
  }

  static async createClient(req: Request, res: Response) {
    try {
      const client = await ClientService.createClient(req.body);
      return res.status(HTTP_STATUS.CREATED).json(client);
    } catch (err: any) {
      const statusCode = err.message === 'El email del cliente ya existe' ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return BaseController.handleError(res, err, 'Error al crear cliente', statusCode);
    }
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const client = await BaseController.handleNotFound(
        res,
        () => ClientService.updateClient(validation.parsedId!, req.body),
        ERROR_MESSAGES.CLIENT_NOT_FOUND
      );

      if (!client) return; // Response already sent
      return res.json(client);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al actualizar cliente');
    }
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const deleted = await ClientService.deleteClient(validation.parsedId!);
      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.CLIENT_NOT_FOUND });
      }

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al eliminar cliente');
    }
  }
}
