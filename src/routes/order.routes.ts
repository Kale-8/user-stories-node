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
 *     description: Retorna la lista completa de pedidos en el sistema
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *             example:
 *               - id: 1
 *                 clienteId: 1
 *                 vendedorId: 2
 *                 total: 150.50
 *                 estado: "pendiente"
 *                 fechaPedido: "2024-01-15T10:30:00Z"
 *                 cliente:
 *                   id: 1
 *                   nombre: "Juan Pérez"
 *                   email: "juan@email.com"
 *                 vendedor:
 *                   id: 2
 *                   nombre: "María García"
 *                   email: "maria@sportsline.local"
 *                 productos:
 *                   - id: 1
 *                     cantidad: 2
 *                     precioUnitario: 25.5
 *                     subtotal: 51.0
 *                     producto:
 *                       id: 1
 *                       codigo: "P001"
 *                       nombre: "Balón de fútbol"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
orderRouter.get('/', requireRole(['admin', 'vendedor']), OrderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *     description: Retorna los detalles completos de un pedido específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del pedido
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               id: 1
 *               clienteId: 1
 *               vendedorId: 2
 *               total: 150.50
 *               estado: "pendiente"
 *               fechaPedido: "2024-01-15T10:30:00Z"
 *               cliente:
 *                 id: 1
 *                 nombre: "Juan Pérez"
 *                 email: "juan@email.com"
 *                 telefono: "+1234567890"
 *               vendedor:
 *                 id: 2
 *                 nombre: "María García"
 *                 email: "maria@sportsline.local"
 *                 rol: "vendedor"
 *               productos:
 *                 - id: 1
 *                   cantidad: 2
 *                   precioUnitario: 25.5
 *                   subtotal: 51.0
 *                   producto:
 *                     id: 1
 *                     codigo: "P001"
 *                     nombre: "Balón de fútbol"
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
orderRouter.get('/:id', orderIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrderById);

/**
 * @swagger
 * /orders/client/{clienteId}:
 *   get:
 *     summary: Obtener pedidos por cliente
 *     description: Retorna todos los pedidos realizados por un cliente específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         description: ID único del cliente
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *             example:
 *               - id: 1
 *                 clienteId: 1
 *                 vendedorId: 2
 *                 total: 150.50
 *                 estado: "pendiente"
 *                 fechaPedido: "2024-01-15T10:30:00Z"
 *                 cliente:
 *                   id: 1
 *                   nombre: "Juan Pérez"
 *                   email: "juan@email.com"
 *                 vendedor:
 *                   id: 2
 *                   nombre: "María García"
 *                   email: "maria@sportsline.local"
 *                 productos:
 *                   - id: 1
 *                     cantidad: 2
 *                     precioUnitario: 25.5
 *                     subtotal: 51.0
 *                     producto:
 *                       id: 1
 *                       codigo: "P001"
 *                       nombre: "Balón de fútbol"
 *       400:
 *         description: ID de cliente inválido
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
 */
orderRouter.get('/client/:clienteId', clientIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrdersByClient);

/**
 * @swagger
 * /orders/product/{productoId}:
 *   get:
 *     summary: Obtener pedidos por producto
 *     description: Retorna todos los pedidos que contienen un producto específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         description: ID único del producto
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de pedidos del producto obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *             example:
 *               - id: 1
 *                 clienteId: 1
 *                 vendedorId: 2
 *                 total: 150.50
 *                 estado: "pendiente"
 *                 fechaPedido: "2024-01-15T10:30:00Z"
 *                 cliente:
 *                   id: 1
 *                   nombre: "Juan Pérez"
 *                   email: "juan@email.com"
 *                 vendedor:
 *                   id: 2
 *                   nombre: "María García"
 *                   email: "maria@sportsline.local"
 *                 productos:
 *                   - id: 1
 *                     cantidad: 2
 *                     precioUnitario: 25.5
 *                     subtotal: 51.0
 *                     producto:
 *                       id: 1
 *                       codigo: "P001"
 *                       nombre: "Balón de fútbol"
 *       400:
 *         description: ID de producto inválido
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
 */
orderRouter.get('/product/:productoId', productIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), OrderController.getOrdersByProduct);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear nuevo pedido
 *     description: Crea un nuevo pedido con productos. Solo vendedores pueden crear pedidos. Valida stock disponible.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           examples:
 *             pedido_simple:
 *               summary: Pedido con un producto
 *               value:
 *                 clienteId: 1
 *                 productos:
 *                   - productoId: 1
 *                     cantidad: 2
 *             pedido_multiple:
 *               summary: Pedido con múltiples productos
 *               value:
 *                 clienteId: 2
 *                 productos:
 *                   - productoId: 1
 *                     cantidad: 1
 *                   - productoId: 2
 *                     cantidad: 3
 *                   - productoId: 3
 *                     cantidad: 1
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               id: 1
 *               clienteId: 1
 *               vendedorId: 2
 *               total: 51.0
 *               estado: "pendiente"
 *               fechaPedido: "2024-01-15T10:30:00Z"
 *               cliente:
 *                 id: 1
 *                 nombre: "Juan Pérez"
 *                 email: "juan@email.com"
 *               vendedor:
 *                 id: 2
 *                 nombre: "María García"
 *                 email: "maria@sportsline.local"
 *               productos:
 *                 - id: 1
 *                   cantidad: 2
 *                   precioUnitario: 25.5
 *                   subtotal: 51.0
 *                   producto:
 *                     id: 1
 *                     codigo: "P001"
 *                     nombre: "Balón de fútbol"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Stock insuficiente para el producto P001"
 */
orderRouter.post('/', requireRole(['vendedor']), createOrderValidation, handleValidationErrors, OrderController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Actualizar estado del pedido
 *     description: Actualiza el estado de un pedido existente. Solo administradores pueden cambiar estados.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del pedido a actualizar
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *           examples:
 *             confirmar:
 *               summary: Confirmar pedido
 *               value:
 *                 estado: "confirmado"
 *             enviar:
 *               summary: Marcar como enviado
 *               value:
 *                 estado: "enviado"
 *             entregar:
 *               summary: Marcar como entregado
 *               value:
 *                 estado: "entregado"
 *             cancelar:
 *               summary: Cancelar pedido
 *               value:
 *                 estado: "cancelado"
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               id: 1
 *               clienteId: 1
 *               vendedorId: 2
 *               total: 150.50
 *               estado: "confirmado"
 *               fechaPedido: "2024-01-15T10:30:00Z"
 *               cliente:
 *                 id: 1
 *                 nombre: "Juan Pérez"
 *                 email: "juan@email.com"
 *               vendedor:
 *                 id: 2
 *                 nombre: "María García"
 *                 email: "maria@sportsline.local"
 *               productos:
 *                 - id: 1
 *                   cantidad: 2
 *                   precioUnitario: 25.5
 *                   subtotal: 51.0
 *                   producto:
 *                     id: 1
 *                     codigo: "P001"
 *                     nombre: "Balón de fútbol"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
orderRouter.put('/:id/status', orderIdValidation, handleValidationErrors, requireRole(['admin']), updateOrderStatusValidation, handleValidationErrors, OrderController.updateOrderStatus);

export default orderRouter;
