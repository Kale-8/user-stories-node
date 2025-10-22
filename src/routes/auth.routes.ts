import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidation, loginValidation, refreshValidation } from '../validators/auth.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const authRouter = Router();

authRouter.post('/register', registerValidation, handleValidationErrors, AuthController.register);
authRouter.post('/login', loginValidation, handleValidationErrors, AuthController.login);
authRouter.post('/refresh', refreshValidation, handleValidationErrors, AuthController.refresh);

export default authRouter;


