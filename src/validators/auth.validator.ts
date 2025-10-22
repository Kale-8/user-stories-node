import { body } from 'express-validator';
import { ValidationUtil } from '../utils/validation.util';

export const registerValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .custom((value) => {
      if (!ValidationUtil.validateName(value, 2, 100)) {
        throw new Error('El nombre debe tener entre 2 y 100 caracteres');
      }
      return true;
    }),
  
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .custom((value) => {
      if (!ValidationUtil.validateEmail(value)) {
        throw new Error('Formato de email inválido');
      }
      return true;
    })
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .custom((value) => {
      if (!ValidationUtil.validatePassword(value)) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      return true;
    }),
  
  body('rol')
    .isIn(['admin', 'vendedor'])
    .withMessage('El rol debe ser admin o vendedor')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

export const refreshValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('El refresh token es requerido')
];
