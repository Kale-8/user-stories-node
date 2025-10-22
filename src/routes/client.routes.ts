import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const clientRouter = Router();

// Apply authentication to all client routes
clientRouter.use(authenticateToken);

// GET /clients - Get all clients (admin and vendedor)
clientRouter.get('/', requireRole(['admin', 'vendedor']), ClientController.getAllClients);

// GET /clients/:id - Get client by ID (admin and vendedor)
clientRouter.get('/:id', requireRole(['admin', 'vendedor']), ClientController.getClientById);

// POST /clients - Create client (admin only)
clientRouter.post('/', requireRole(['admin']), ClientController.createClient);

// PUT /clients/:id - Update client (admin only)
clientRouter.put('/:id', requireRole(['admin']), ClientController.updateClient);

// DELETE /clients/:id - Delete client (admin only)
clientRouter.delete('/:id', requireRole(['admin']), ClientController.deleteClient);

export default clientRouter;
