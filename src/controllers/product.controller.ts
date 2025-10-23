import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { BaseController } from './base.controller';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ProductController extends BaseController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      return res.json(products);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener productos');
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const product = await BaseController.handleNotFound(
        res,
        () => ProductService.getProductById(validation.parsedId!),
        ERROR_MESSAGES.PRODUCT_NOT_FOUND
      );

      if (!product) return; // Response already sent
      return res.json(product);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al obtener producto');
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      return res.status(HTTP_STATUS.CREATED).json(product);
    } catch (err: any) {
      const statusCode = err.message === ERROR_MESSAGES.DUPLICATE_PRODUCT_CODE ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return BaseController.handleError(res, err, 'Error al crear producto', statusCode);
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const product = await BaseController.handleNotFound(
        res,
        () => ProductService.updateProduct(validation.parsedId!, req.body),
        ERROR_MESSAGES.PRODUCT_NOT_FOUND
      );

      if (!product) return; // Response already sent
      return res.json(product);
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al actualizar producto');
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const validation = BaseController.validateId(req.params.id);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation.error });
      }

      const deleted = await ProductService.deleteProduct(validation.parsedId!);
      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err: any) {
      return BaseController.handleError(res, err, 'Error al eliminar producto');
    }
  }
}
