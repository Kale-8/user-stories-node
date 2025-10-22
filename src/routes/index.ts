import { Router } from 'express';
import authRouter from './auth.routes';
import protectedRouter from './protected.routes';
import productRouter from './product.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/products', productRouter);

export default router;
