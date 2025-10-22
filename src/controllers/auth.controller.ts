import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { BaseController } from './base.controller';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class AuthController extends BaseController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error en registro', HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.json(result);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error en login', HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }
      const result = await AuthService.refreshToken(refreshToken);
      return res.json(result);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error en refresh', HTTP_STATUS.UNAUTHORIZED);
    }
  }
}


