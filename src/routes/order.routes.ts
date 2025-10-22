import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createOrderValidation, updateOrderStatusValidation, orderIdValidation, clientIdValidation, productIdValidation } from '../validators/order.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const orderRouter = Router();

// Apply authentication to all order routes
orderRouter.use(authenticateToken);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
orderRouter.get('/', requireRole(['admin', 'vendedor']), OrderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *     tags: [Orders]
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
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido no encontrado
 *       400:
 *         description: ID inválido
 */
orderRouter.get('/:id', orderIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrderById);

/**
 * @swagger
 * /orders/client/{clienteId}:
 *   get:
 *     summary: Obtener pedidos por cliente
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID de cliente inválido
 */
orderRouter.get('/client/:clienteId', clientIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrdersByClient);

/**
 * @swagger
 * /orders/product/{productoId}:
 *   get:
 *     summary: Obtener pedidos por producto
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de pedidos del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID de producto inválido
 */
orderRouter.get('/product/:productoId', productIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrdersByProduct);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear nuevo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - productos
 *             properties:
 *               clienteId:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                   properties:
 *                     productoId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error de validación o stock insuficiente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo vendedores pueden crear pedidos
 */
orderRouter.post('/', requireRole(['vendedor']), createOrderValidation, handleValidationErrors, OrderController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Actualizar estado del pedido
 *     tags: [Orders]
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
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmado, enviado, entregado, cancelado]
 *                 example: "confirmado"
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido no encontrado
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Solo administradores pueden actualizar estados
 */
orderRouter.put('/:id/status', orderIdValidation, handleValidationErrors, requireRole(['admin']), updateOrderStatusValidation, handleValidationErrors, OrderController.updateOrderStatus);

export default orderRouter;
