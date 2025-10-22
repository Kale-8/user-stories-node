import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SportsLine API',
      version: '1.0.0',
      description: 'API para gestión de productos, clientes y pedidos de SportsLine',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Admin' },
            email: { type: 'string', example: 'admin@sportsline.local' },
            rol: { type: 'string', enum: ['admin', 'vendedor'], example: 'admin' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'P001' },
            nombre: { type: 'string', example: 'Balón de fútbol' },
            precio: { type: 'number', format: 'float', example: 25.5 },
            stock: { type: 'integer', example: 100 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@email.com' },
            telefono: { type: 'string', example: '+1234567890' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            clienteId: { type: 'integer', example: 1 },
            vendedorId: { type: 'integer', example: 2 },
            total: { type: 'number', format: 'float', example: 150.50 },
            estado: { type: 'string', enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'], example: 'pendiente' },
            fechaPedido: { type: 'string', format: 'date-time' },
            cliente: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@email.com' }
              }
            },
            vendedor: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                nombre: { type: 'string', example: 'María García' },
                email: { type: 'string', example: 'maria@sportsline.local' }
              }
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
          },
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
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
