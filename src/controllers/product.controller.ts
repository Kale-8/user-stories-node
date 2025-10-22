import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      return res.json(products);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener productos' });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const product = await ProductService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al obtener producto' });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (err: any) {
      if (err.message === 'El código del producto ya existe') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message || 'Error al crear producto' });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const product = await ProductService.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al actualizar producto' });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const deleted = await ProductService.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.status(204).send();
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error al eliminar producto' });
    }
  }
}
