import { Router } from 'express';
import authRouter from './auth.routes';
import protectedRouter from './protected.routes';
import productRouter from './product.routes';
import clientRouter from './client.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/products', productRouter);
router.use('/clients', clientRouter);

export default router;
