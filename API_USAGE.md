# SportsLine API - Usage Guide

## 🚀 Quick Start

### 1. Authentication

#### Register an admin user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin Principal",
    "email": "admin@sportsline.local",
    "password": "admin123",
    "rol": "admin"
  }'
```

#### Register a salesperson
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Vendedor",
    "email": "juan@sportsline.local",
    "password": "vendedor123",
    "rol": "vendedor"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sportsline.local",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "nombre": "Admin Principal",
    "email": "admin@sportsline.local",
    "rol": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Product Management

#### List products
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Create product (admin only)
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "P004",
    "nombre": "Balón de fútbol profesional",
    "precio": 35.99,
    "stock": 75
  }'
```

#### Update product (admin only)
```bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Balón de fútbol actualizado",
    "precio": 32.99,
    "stock": 80
  }'
```

### 3. Client Management

#### Create client (admin only)
```bash
curl -X POST http://localhost:3000/clients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos López",
    "email": "carlos@email.com",
    "telefono": "+1234567892"
  }'
```

#### List clients
```bash
curl -X GET http://localhost:3000/clients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Order Management

#### Create order (salesperson only)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "productos": [
      {
        "productoId": 1,
        "cantidad": 2
      },
      {
        "productoId": 2,
        "cantidad": 1
      }
    ]
  }'
```

#### List orders
```bash
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update order status (admin only)
```bash
curl -X PUT http://localhost:3000/orders/1/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "confirmado"
  }'
```

### 5. Advanced Queries

#### Orders by client
```bash
curl -X GET http://localhost:3000/orders/client/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Orders by product
```bash
curl -X GET http://localhost:3000/orders/product/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Roles and Permissions

### Administrator (admin)
- ✅ Create, update and delete products
- ✅ Create, update and delete clients
- ✅ Update order statuses
- ✅ View all resources

### Salesperson (vendedor)
- ✅ View products and clients
- ✅ Create orders
- ✅ View orders
- ❌ Cannot modify products or clients
- ❌ Cannot change order statuses

## 📊 Order Statuses

- `pendiente` - Order created, awaiting confirmation
- `confirmado` - Order confirmed by administrator
- `enviado` - Order shipped to customer
- `entregado` - Order successfully delivered
- `cancelado` - Order cancelled

## 🚨 Error Handling

### Common errors

#### 401 - Unauthorized
```json
{
  "message": "Token de acceso inválido"
}
```

#### 403 - Access denied
```json
{
  "message": "Acceso denegado"
}
```

#### 404 - Resource not found
```json
{
  "message": "Producto no encontrado"
}
```

#### 400 - Validation error
```json
{
  "message": "Error de validación",
  "errors": [
    {
      "msg": "El código del producto ya existe",
      "param": "codigo",
      "location": "body"
    }
  ]
}
```

## 🔄 Token Refresh

When the access token expires, use the refresh token:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📈 Monitoring

### Health Check
```bash
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🧪 Testing

### Run tests
```bash
npm test
```

### Coverage
```bash
npm run test:coverage
```

## 📚 Interactive Documentation

Access Swagger UI at: `http://localhost:3000/api-docs`

Here you can:
- View all available endpoints
- Test the API directly from the browser
- See request/response examples
- Download the OpenAPI specification
