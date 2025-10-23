import { body, param } from 'express-validator';

export const createProductValidation = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 1, max: 50 })
    .withMessage('El código debe tener entre 1 y 50 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('El código debe contener solo letras mayúsculas y números'),
  
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo')
];

export const updateProductValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo')
];

export const productIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];
