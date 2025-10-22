import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SportsLine API',
      version: '1.0.0',
      description: 'API completa para gestión de productos, clientes, usuarios y pedidos de SportsLine. Incluye autenticación JWT, roles de usuario, validaciones y documentación completa.',
      contact: {
        name: 'SportsLine Development Team',
        email: 'dev@sportsline.local'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo local',
      },
      {
        url: 'https://api.sportsline.local',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint de login'
        },
      },
      schemas: {
        // Auth Schemas
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password', 'rol'],
          properties: {
            nombre: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 100, 
              example: 'Juan Pérez',
              description: 'Nombre completo del usuario'
            },
            email: { 
              type: 'string', 
              format: 'email', 
              example: 'juan@sportsline.local',
              description: 'Email único del usuario'
            },
            password: { 
              type: 'string', 
              minLength: 6, 
              example: 'password123',
              description: 'Contraseña del usuario (mínimo 6 caracteres)'
            },
            rol: { 
              type: 'string', 
              enum: ['admin', 'vendedor'], 
              example: 'vendedor',
              description: 'Rol del usuario en el sistema'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { 
              type: 'string', 
              format: 'email', 
              example: 'admin@sportsline.local',
              description: 'Email del usuario'
            },
            password: { 
              type: 'string', 
              example: 'admin123',
              description: 'Contraseña del usuario'
            }
          }
        },
        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Refresh token válido'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Token de acceso JWT'
            },
            refreshToken: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Token de renovación JWT'
            }
          }
        },
        
        // Product Schemas
        CreateProductRequest: {
          type: 'object',
          required: ['codigo', 'nombre', 'precio', 'stock'],
          properties: {
            codigo: { 
              type: 'string', 
              pattern: '^[A-Z0-9]+$',
              maxLength: 50,
              example: 'P001',
              description: 'Código único del producto (solo letras mayúsculas y números)'
            },
            nombre: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 150, 
              example: 'Balón de fútbol profesional',
              description: 'Nombre del producto'
            },
            precio: { 
              type: 'number', 
              format: 'float', 
              minimum: 0,
              example: 25.50,
              description: 'Precio del producto en USD'
            },
            stock: { 
              type: 'integer', 
              minimum: 0,
              example: 100,
              description: 'Cantidad disponible en inventario'
            }
          }
        },
        UpdateProductRequest: {
          type: 'object',
          properties: {
            nombre: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 150, 
              example: 'Balón de fútbol profesional actualizado'
            },
            precio: { 
              type: 'number', 
              format: 'float', 
              minimum: 0,
              example: 27.99
            },
            stock: { 
              type: 'integer', 
              minimum: 0,
              example: 85
            }
          }
        },
        
        // Client Schemas
        CreateClientRequest: {
          type: 'object',
          required: ['nombre', 'email'],
          properties: {
            nombre: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 150, 
              example: 'María García',
              description: 'Nombre completo del cliente'
            },
            email: { 
              type: 'string', 
              format: 'email', 
              example: 'maria@email.com',
              description: 'Email único del cliente'
            },
            telefono: { 
              type: 'string', 
              pattern: '^[\\+]?[0-9\\s\\-\\(\\)]+$',
              minLength: 7,
              maxLength: 30,
              example: '+1234567890',
              description: 'Número de teléfono del cliente'
            }
          }
        },
        UpdateClientRequest: {
          type: 'object',
          properties: {
            nombre: { 
              type: 'string', 
              minLength: 2, 
              maxLength: 150, 
              example: 'María García López'
            },
            email: { 
              type: 'string', 
              format: 'email', 
              example: 'maria.garcia@email.com'
            },
            telefono: { 
              type: 'string', 
              pattern: '^[\\+]?[0-9\\s\\-\\(\\)]+$',
              minLength: 7,
              maxLength: 30,
              example: '+1234567891'
            }
          }
        },
        
        // Order Schemas
        CreateOrderRequest: {
          type: 'object',
          required: ['clienteId', 'productos'],
          properties: {
            clienteId: { 
              type: 'integer', 
              example: 1,
              description: 'ID del cliente que realiza el pedido'
            },
            productos: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['productoId', 'cantidad'],
                properties: {
                  productoId: { 
                    type: 'integer', 
                    example: 1,
                    description: 'ID del producto'
                  },
                  cantidad: { 
                    type: 'integer', 
                    minimum: 1,
                    example: 2,
                    description: 'Cantidad del producto'
                  }
                }
              },
              example: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 1 }
              ]
            }
          }
        },
        UpdateOrderStatusRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { 
              type: 'string', 
              enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'], 
              example: 'confirmado',
              description: 'Nuevo estado del pedido'
            }
          }
        },
        
        // Response Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Admin' },
            email: { type: 'string', example: 'admin@sportsline.local' },
            rol: { type: 'string', enum: ['admin', 'vendedor'], example: 'admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'P001' },
            nombre: { type: 'string', example: 'Balón de fútbol' },
            precio: { type: 'number', format: 'float', example: 25.5 },
            stock: { type: 'integer', example: 100 },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@email.com' },
            telefono: { type: 'string', example: '+1234567890' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            clienteId: { type: 'integer', example: 1 },
            vendedorId: { type: 'integer', example: 2 },
            total: { type: 'number', format: 'float', example: 150.50 },
            estado: { type: 'string', enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'], example: 'pendiente' },
            fechaPedido: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            cliente: {
              $ref: '#/components/schemas/Client'
            },
            vendedor: {
              $ref: '#/components/schemas/User'
            },
            productos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  cantidad: { type: 'integer', example: 2 },
                  precioUnitario: { type: 'number', format: 'float', example: 25.5 },
                  subtotal: { type: 'number', format: 'float', example: 51.0 },
                  producto: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      codigo: { type: 'string', example: 'P001' },
                      nombre: { type: 'string', example: 'Balón de fútbol' }
                    }
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string', example: 'Invalid value' },
                  param: { type: 'string', example: 'email' },
                  location: { type: 'string', example: 'body' },
                },
              },
            },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operación exitosa' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso inválido o faltante',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Token de acceso inválido'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Acceso denegado - permisos insuficientes',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Acceso denegado'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Recurso no encontrado'
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación en los datos enviados',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Error de validación',
                errors: [
                  {
                    msg: 'El email debe ser válido',
                    param: 'email',
                    location: 'body'
                  }
                ]
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints de autenticación y autorización'
      },
      {
        name: 'Products',
        description: 'Gestión de productos del catálogo'
      },
      {
        name: 'Clients',
        description: 'Gestión de clientes'
      },
      {
        name: 'Orders',
        description: 'Gestión de pedidos y órdenes'
      },
      {
        name: 'Health',
        description: 'Endpoints de salud del sistema'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
