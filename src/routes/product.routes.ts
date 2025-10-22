import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createProductValidation, updateProductValidation, productIdValidation } from '../validators/product.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const productRouter = Router();

// Apply authentication to all product routes
productRouter.use(authenticateToken);

// GET /products - Get all products (admin and vendedor)
productRouter.get('/', requireRole(['admin', 'vendedor']), ProductController.getAllProducts);

// GET /products/:id - Get product by ID (admin and vendedor)
productRouter.get('/:id', productIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), ProductController.getProductById);

// POST /products - Create product (admin only)
productRouter.post('/', requireRole(['admin']), createProductValidation, handleValidationErrors, ProductController.createProduct);

// PUT /products/:id - Update product (admin only)
productRouter.put('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), updateProductValidation, handleValidationErrors, ProductController.updateProduct);

// DELETE /products/:id - Delete product (admin only)
productRouter.delete('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), ProductController.deleteProduct);

export default productRouter;
