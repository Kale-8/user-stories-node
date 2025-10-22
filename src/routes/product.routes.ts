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
 *     description: Retorna la lista completa de productos disponibles en el catálogo
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *               - id: 1
 *                 codigo: "P001"
 *                 nombre: "Balón de fútbol"
 *                 precio: 25.5
 *                 stock: 100
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *               - id: 2
 *                 codigo: "P002"
 *                 nombre: "Raqueta de tenis"
 *                 precio: 89.99
 *                 stock: 50
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
productRouter.get('/', requireRole(['admin', 'vendedor']), ProductController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Retorna los detalles de un producto específico por su ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del producto
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               codigo: "P001"
 *               nombre: "Balón de fútbol"
 *               precio: 25.5
 *               stock: 100
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "ID inválido"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
productRouter.get('/:id', productIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), ProductController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear nuevo producto
 *     description: Crea un nuevo producto en el catálogo. Solo administradores pueden crear productos.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           examples:
 *             balon:
 *               summary: Balón de fútbol
 *               value:
 *                 codigo: "P004"
 *                 nombre: "Balón de fútbol profesional"
 *                 precio: 35.99
 *                 stock: 75
 *             raqueta:
 *               summary: Raqueta de tenis
 *               value:
 *                 codigo: "P005"
 *                 nombre: "Raqueta de tenis Wilson"
 *                 precio: 120.50
 *                 stock: 25
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 4
 *               codigo: "P004"
 *               nombre: "Balón de fútbol profesional"
 *               precio: 35.99
 *               stock: 75
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Código de producto duplicado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "El código del producto ya existe"
 */
productRouter.post('/', requireRole(['admin']), createProductValidation, handleValidationErrors, ProductController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     description: Actualiza los datos de un producto existente. Solo administradores pueden actualizar productos.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del producto a actualizar
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *           examples:
 *             update_precio:
 *               summary: Actualizar precio y stock
 *               value:
 *                 nombre: "Balón de fútbol profesional actualizado"
 *                 precio: 32.99
 *                 stock: 80
 *             update_stock:
 *               summary: Solo actualizar stock
 *               value:
 *                 stock: 120
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               codigo: "P001"
 *               nombre: "Balón de fútbol profesional actualizado"
 *               precio: 32.99
 *               stock: 80
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T11:45:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
productRouter.put('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), updateProductValidation, handleValidationErrors, ProductController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     description: Elimina un producto del catálogo. Solo administradores pueden eliminar productos.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del producto a eliminar
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "ID inválido"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
productRouter.delete('/:id', productIdValidation, handleValidationErrors, requireRole(['admin']), ProductController.deleteProduct);

export default productRouter;
