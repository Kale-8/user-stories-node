import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Error en registro' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const user = await AuthService.login(req.body);
      return res.json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Error en login' });
    }
  }
}


