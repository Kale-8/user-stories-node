import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Error en registro' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Error en login' });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token requerido' });
      }
      const result = await AuthService.refreshToken(refreshToken);
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ message: err.message || 'Error en refresh' });
    }
  }
}


