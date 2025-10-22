import { body, param } from 'express-validator';

export const createClientValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .isLength({ min: 7, max: 30 })
    .withMessage('El teléfono debe tener entre 7 y 30 caracteres')
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe contener solo números, espacios, guiones y paréntesis')
];

export const updateClientValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .isLength({ min: 7, max: 30 })
    .withMessage('El teléfono debe tener entre 7 y 30 caracteres')
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe contener solo números, espacios, guiones y paréntesis')
];

export const clientIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];
