import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createClientValidation, updateClientValidation, clientIdValidation } from '../validators/client.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const clientRouter = Router();

// Apply authentication to all client routes
clientRouter.use(authenticateToken);

// GET /clients - Get all clients (admin and vendedor)
clientRouter.get('/', requireRole(['admin', 'vendedor']), ClientController.getAllClients);

// GET /clients/:id - Get client by ID (admin and vendedor)
clientRouter.get('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin', 'vendedor']), ClientController.getClientById);

// POST /clients - Create client (admin only)
clientRouter.post('/', requireRole(['admin']), createClientValidation, handleValidationErrors, ClientController.createClient);

// PUT /clients/:id - Update client (admin only)
clientRouter.put('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin']), updateClientValidation, handleValidationErrors, ClientController.updateClient);

// DELETE /clients/:id - Delete client (admin only)
clientRouter.delete('/:id', clientIdValidation, handleValidationErrors, requireRole(['admin']), ClientController.deleteClient);

export default clientRouter;
