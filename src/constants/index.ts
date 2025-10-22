export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
} as const;

export const ORDER_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  ENVIADO: 'enviado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
} as const;

export const ERROR_MESSAGES = {
  INVALID_ID: 'ID inválido',
  RESOURCE_NOT_FOUND: 'Recurso no encontrado',
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  CLIENT_NOT_FOUND: 'Cliente no encontrado',
  ORDER_NOT_FOUND: 'Pedido no encontrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  DUPLICATE_PRODUCT_CODE: 'El código del producto ya existe',
  INSUFFICIENT_STOCK: 'Stock insuficiente',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  ACCESS_DENIED: 'Acceso denegado',
  REFRESH_TOKEN_REQUIRED: 'Refresh token requerido',
  INTERNAL_ERROR: 'Error interno del servidor',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Usuario creado exitosamente',
  LOGIN_SUCCESS: 'Login exitoso',
  REFRESH_SUCCESS: 'Token renovado exitosamente',
  PRODUCT_CREATED: 'Producto creado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',
  CLIENT_CREATED: 'Cliente creado exitosamente',
  CLIENT_UPDATED: 'Cliente actualizado exitosamente',
  CLIENT_DELETED: 'Cliente eliminado exitosamente',
  ORDER_CREATED: 'Pedido creado exitosamente',
  ORDER_UPDATED: 'Pedido actualizado exitosamente',
} as const;

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 150,
  PASSWORD_MIN_LENGTH: 6,
  PRODUCT_CODE_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 30,
} as const;
