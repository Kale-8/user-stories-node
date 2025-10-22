import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

export class ClientController {
  static async getAllClients(req: Request, res: Response) {
    try {
      const clients = await ClientService.getAllClients();
      return res.json(clients);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener clientes' });
    }
  }

  static async getClientById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const client = await ClientService.getClientById(id);
      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      return res.json(client);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener cliente' });
    }
  }

  static async createClient(req: Request, res: Response) {
    try {
      const client = await ClientService.createClient(req.body);
      return res.status(201).json(client);
    } catch (err: any) {
      if (err.message === 'El email del cliente ya existe') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message || 'Error al crear cliente' });
    }
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const client = await ClientService.updateClient(id, req.body);
      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      return res.json(client);
    } catch (err: any) {
      if (err.message === 'El email del cliente ya existe') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message || 'Error al actualizar cliente' });
    }
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const deleted = await ClientService.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      return res.status(204).send();
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al eliminar cliente' });
    }
  }
}
