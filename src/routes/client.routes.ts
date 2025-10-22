import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createClientValidation, updateClientValidation, clientIdValidation } from '../validators/client.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const clientRouter = Router();

// Apply authentication to all client routes
clientRouter.use(authenticateToken);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Retorna la lista completa de clientes registrados en el sistema
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *             example:
 *               - id: 1
 *                 nombre: "Juan Pérez"
 *                 email: "juan@email.com"
 *                 telefono: "+1234567890"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *               - id: 2
 *                 nombre: "María García"
 *                 email: "maria@email.com"
 *                 telefono: "+1234567891"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
clientRouter.get('/', requireRole(['admin', 'vendedor']), ClientController.getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     description: Retorna los detalles de un cliente específico por su ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del cliente
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *             example:
 *               id: 1
 *               nombre: "Juan Pérez"
 *               email: "juan@email.com"
 *               telefono: "+1234567890"
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
clientRouter.get('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), ClientController.getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Crear nuevo cliente
 *     description: Crea un nuevo cliente en el sistema. Solo administradores pueden crear clientes.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClientRequest'
 *           examples:
 *             cliente_completo:
 *               summary: Cliente con todos los datos
 *               value:
 *                 nombre: "Carlos López"
 *                 email: "carlos@email.com"
 *                 telefono: "+1234567892"
 *             cliente_basico:
 *               summary: Cliente con datos mínimos
 *               value:
 *                 nombre: "Ana Martínez"
 *                 email: "ana@email.com"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *             example:
 *               id: 3
 *               nombre: "Carlos López"
 *               email: "carlos@email.com"
 *               telefono: "+1234567892"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "El email ya está registrado"
 */
clientRouter.post('/', requireRole(['admin']), createClientValidation, handleValidationErrors, ClientController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     description: Actualiza los datos de un cliente existente. Solo administradores pueden actualizar clientes.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del cliente a actualizar
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClientRequest'
 *           examples:
 *             actualizar_nombre:
 *               summary: Actualizar nombre y teléfono
 *               value:
 *                 nombre: "Juan Carlos Pérez"
 *                 telefono: "+1234567893"
 *             actualizar_email:
 *               summary: Actualizar email
 *               value:
 *                 email: "juan.carlos@email.com"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *             example:
 *               id: 1
 *               nombre: "Juan Carlos Pérez"
 *               email: "juan@email.com"
 *               telefono: "+1234567893"
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
clientRouter.put('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin']), updateClientValidation, handleValidationErrors, ClientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     description: Elimina un cliente del sistema. Solo administradores pueden eliminar clientes.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del cliente a eliminar
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente
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
clientRouter.delete('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin']), ClientController.deleteClient);

export default clientRouter;
