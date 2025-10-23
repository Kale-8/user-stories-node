import { body, param } from 'express-validator';

export const createOrderValidation = [
  body('clienteId')
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),
  
  body('productos')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  
  body('productos.*.productoId')
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo'),
  
  body('productos.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo')
];

export const updateOrderStatusValidation = [
  body('estado')
    .isIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'])
    .withMessage('El estado debe ser uno de: pendiente, confirmado, enviado, entregado, cancelado')
];

export const orderIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

export const clientIdValidation = [
  param('clienteId')
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo')
];

export const productIdValidation = [
  param('productoId')
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo')
];
