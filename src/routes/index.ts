import { Router } from 'express';
import authRouter from './auth.routes';
import protectedRouter from './protected.routes';
import productRouter from './product.routes';
import clientRouter from './client.routes';
import orderRouter from './order.routes';
import { specs, swaggerUi } from '../config/swagger';

const router = Router();

// Swagger documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/products', productRouter);
router.use('/clients', clientRouter);
router.use('/orders', orderRouter);

export default router;
