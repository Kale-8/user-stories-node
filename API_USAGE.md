# SportsLine API - Guía de Uso

## 🚀 Inicio Rápido

### 1. Autenticación

#### Registrar un usuario administrador
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

#### Registrar un vendedor
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

#### Iniciar sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sportsline.local",
    "password": "admin123"
  }'
```

**Respuesta:**
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

### 2. Gestión de Productos

#### Listar productos
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Crear producto (solo admin)
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

#### Actualizar producto (solo admin)
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

### 3. Gestión de Clientes

#### Crear cliente (solo admin)
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

#### Listar clientes
```bash
curl -X GET http://localhost:3000/clients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Gestión de Pedidos

#### Crear pedido (solo vendedor)
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

#### Listar pedidos
```bash
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Actualizar estado del pedido (solo admin)
```bash
curl -X PUT http://localhost:3000/orders/1/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "confirmado"
  }'
```

### 5. Consultas Avanzadas

#### Pedidos por cliente
```bash
curl -X GET http://localhost:3000/orders/client/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Pedidos por producto
```bash
curl -X GET http://localhost:3000/orders/product/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Roles y Permisos

### Administrador (admin)
- ✅ Crear, actualizar y eliminar productos
- ✅ Crear, actualizar y eliminar clientes
- ✅ Actualizar estados de pedidos
- ✅ Ver todos los recursos

### Vendedor (vendedor)
- ✅ Ver productos y clientes
- ✅ Crear pedidos
- ✅ Ver pedidos
- ❌ No puede modificar productos o clientes
- ❌ No puede cambiar estados de pedidos

## 📊 Estados de Pedidos

- `pendiente` - Pedido creado, esperando confirmación
- `confirmado` - Pedido confirmado por administrador
- `enviado` - Pedido enviado al cliente
- `entregado` - Pedido entregado exitosamente
- `cancelado` - Pedido cancelado

## 🚨 Manejo de Errores

### Errores comunes

#### 401 - No autorizado
```json
{
  "message": "Token de acceso inválido"
}
```

#### 403 - Acceso denegado
```json
{
  "message": "Acceso denegado"
}
```

#### 404 - Recurso no encontrado
```json
{
  "message": "Producto no encontrado"
}
```

#### 400 - Error de validación
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

## 🔄 Renovación de Tokens

Cuando el token de acceso expire, usa el refresh token:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📈 Monitoreo

### Health Check
```bash
curl -X GET http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🧪 Testing

### Ejecutar tests
```bash
npm test
```

### Coverage
```bash
npm run test:coverage
```

## 📚 Documentación Interactiva

Accede a Swagger UI en: `http://localhost:3000/api-docs`

Aquí podrás:
- Ver todos los endpoints disponibles
- Probar la API directamente desde el navegador
- Ver ejemplos de request/response
- Descargar la especificación OpenAPI
