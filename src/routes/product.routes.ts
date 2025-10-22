import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createProductValidation, updateProductValidation, productIdValidation } from '../validators/product.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const productRouter = Router();

// Apply authentication to all product routes
productRouter.use(authenticateToken);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
productRouter.get('/', requireRole(['admin', 'vendedor']), ProductController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: ID inválido
 */
productRouter.get('/:id', productIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), ProductController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *               - precio
 *               - stock
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "P004"
 *               nombre:
 *                 type: string
 *                 example: "Pelota de tenis"
 *               precio:
 *                 type: number
 *                 example: 15.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación o código duplicado
 *       403:
 *         description: Solo administradores pueden crear productos
 */
productRouter.post('/', requireRole(['admin']), createProductValidation, handleValidationErrors, ProductController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Balón de fútbol actualizado"
 *               precio:
 *                 type: number
 *                 example: 30.0
 *               stock:
 *                 type: integer
 *                 example: 75
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Solo administradores pueden actualizar productos
 */
productRouter.put('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), updateProductValidation, handleValidationErrors, ProductController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: ID inválido
 *       403:
 *         description: Solo administradores pueden eliminar productos
 */
productRouter.delete('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), ProductController.deleteProduct);

export default productRouter;
