import { Router } from 'express';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middlewares/auth.middleware';

const protectedRouter = Router();

// Apply authentication to all routes
protectedRouter.use(authenticateToken);

// Admin only route
protectedRouter.get('/admin-only', requireRole(['admin']), (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Solo administradores pueden ver esto', user: req.user });
});

// Admin or vendedor route
protectedRouter.get('/staff', requireRole(['admin', 'vendedor']), (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Personal autorizado', user: req.user });
});

// Any authenticated user
protectedRouter.get('/profile', (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Perfil del usuario', user: req.user });
});

export default protectedRouter;
