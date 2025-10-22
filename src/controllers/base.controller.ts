import type { Request, Response } from 'express';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class BaseController {
  protected static handleError(res: Response, error: any, defaultMessage: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR): Response {
    const message = error?.message || defaultMessage;
    return res.status(statusCode).json({ message });
  }

  protected static validateId(id: string | undefined): { isValid: boolean; parsedId?: number; error?: string } {
    if (!id) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_ID };
    }
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_ID };
    }
    return { isValid: true, parsedId };
  }

  protected static async handleNotFound<T>(
    res: Response, 
    findOperation: () => Promise<T | null>, 
    notFoundMessage: string = ERROR_MESSAGES.RESOURCE_NOT_FOUND
  ): Promise<T | null> {
    const result = await findOperation();
    if (!result) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: notFoundMessage });
      return null;
    }
    return result;
  }
}
