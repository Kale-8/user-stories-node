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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Verifica el estado de salud del servidor y la conexión a la base de datos
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                   description: Estado del servidor
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00Z"
 *                   description: Timestamp de la verificación
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                   description: Tiempo de funcionamiento en segundos
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                   description: Entorno de ejecución
 *             example:
 *               status: "ok"
 *               timestamp: "2024-01-15T10:30:00Z"
 *               uptime: 3600
 *               environment: "development"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Error interno del servidor"
 */
router.get('/health', (_req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(healthCheck);
});

router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/products', productRouter);
router.use('/clients', clientRouter);
router.use('/orders', orderRouter);

export default router;
