# SportsLine API

API completa para gestión de productos, clientes, usuarios y pedidos de SportsLine. Desarrollada con Node.js, TypeScript, PostgreSQL y Docker.

## 🚀 Características

- **Autenticación JWT** con refresh tokens
- **Roles de usuario** (admin, vendedor)
- **CRUD completo** para productos, clientes y pedidos
- **Validaciones centralizadas** con express-validator
- **Documentación Swagger** completa
- **Encriptación híbrida** (AES-256-GCM + RSA)
- **Arquitectura Clean Code** con DTOs y DAOs
- **Dockerización** con Docker Compose
- **Tests unitarios** con Jest

## 📋 Requisitos

- Node.js 18+ 
- Docker y Docker Compose
- PostgreSQL (incluido en Docker Compose)

## 🛠️ Instalación

### Opción 1: Docker Compose (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd user-stories-node
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus valores:
   ```env
   DATABASE_URI=postgresql://postgres:password@localhost:5432/sportsline
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   RSA_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----
   RSA_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

   El servicio estará disponible en `http://localhost:3000`

### Opción 2: Instalación Local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar base de datos PostgreSQL**
   - Crear base de datos `sportsline`
   - Configurar `.env` con la URI de conexión

3. **Ejecutar migraciones y seeds**
   ```bash
   npm run seed
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🐳 Docker

### Construcción de imagen

```bash
docker build -t sportsline-api .
```

### Ejecución con Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir y ejecutar
docker-compose up --build
```

### Configuración de recursos

El `docker-compose.yml` incluye límites de recursos:
- **CPU**: 0.5 cores máximo, 0.25 cores reservados
- **RAM**: 512MB máximo, 256MB reservados

## 📚 API Documentation

### Swagger UI

Una vez iniciado el servidor, accede a la documentación interactiva:

```
http://localhost:3000/api-docs
```

### Endpoints principales

#### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token

#### Productos
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto (admin)
- `PUT /products/:id` - Actualizar producto (admin)
- `DELETE /products/:id` - Eliminar producto (admin)

#### Clientes
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Obtener cliente
- `POST /clients` - Crear cliente (admin)
- `PUT /clients/:id` - Actualizar cliente (admin)
- `DELETE /clients/:id` - Eliminar cliente (admin)

#### Pedidos
- `GET /orders` - Listar pedidos
- `GET /orders/:id` - Obtener pedido
- `GET /orders/client/:clienteId` - Pedidos por cliente
- `GET /orders/product/:productoId` - Pedidos por producto
- `POST /orders` - Crear pedido (vendedor)
- `PUT /orders/:id/status` - Actualizar estado (admin)

#### Salud del sistema
- `GET /health` - Health check

## 🔐 Autenticación

### Registro de usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "email": "admin@sportsline.local",
    "password": "admin123",
    "rol": "admin"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sportsline.local",
    "password": "admin123"
  }'
```

### Uso de tokens

```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Testing

### Ejecutar tests

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage
```

### Coverage mínimo requerido

- **Branches**: 40%
- **Functions**: 40%
- **Lines**: 40%
- **Statements**: 40%

## 📁 Estructura del proyecto

```
src/
├── config/           # Configuraciones (DB, Swagger)
├── controllers/      # Controladores de rutas
├── dao/             # Data Access Objects
├── dto/             # Data Transfer Objects
├── middlewares/     # Middlewares (auth, validation)
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── utils/           # Utilidades (crypto, validation)
├── validators/      # Validaciones de entrada
├── seeds/           # Datos iniciales
└── __tests__/       # Tests unitarios
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar TypeScript
npm start           # Servidor de producción
npm test            # Ejecutar tests
npm run test:coverage # Tests con coverage
npm run seed        # Ejecutar seeds
```

## 🌍 Variables de entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DATABASE_URI` | URI de conexión a PostgreSQL | ✅ |
| `JWT_SECRET` | Clave secreta para JWT | ✅ |
| `JWT_REFRESH_SECRET` | Clave secreta para refresh tokens | ✅ |
| `RSA_PUBLIC_KEY` | Clave pública RSA para encriptación | ✅ |
| `RSA_PRIVATE_KEY` | Clave privada RSA para encriptación | ✅ |
| `NODE_ENV` | Entorno de ejecución | ❌ |
| `PORT` | Puerto del servidor (default: 3000) | ❌ |

## 🔒 Seguridad

- **Autenticación JWT** con tokens de acceso y renovación
- **Autorización basada en roles** (admin, vendedor)
- **Encriptación híbrida** para datos sensibles
- **Validación de entrada** con express-validator
- **Sanitización de datos** en todos los endpoints
- **Rate limiting** (configurable)

## 🚀 Despliegue

### Producción con Docker

1. **Configurar variables de entorno de producción**
2. **Construir imagen optimizada**
   ```bash
   docker build -t sportsline-api:prod .
   ```
3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Monitoreo

- **Health check**: `GET /health`
- **Logs**: `docker-compose logs -f`
- **Métricas**: Integración con herramientas de monitoreo

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo**: SportsLine Development Team
- **Email**: dev@sportsline.local

## 🆘 Soporte

Para soporte técnico o preguntas:

- **Email**: support@sportsline.local
- **Documentación**: http://localhost:3000/api-docs
- **Issues**: GitHub Issues

---

## 📊 Estado del proyecto

- ✅ **HU1**: Configuración inicial del proyecto
- ✅ **HU2**: Autenticación y roles de usuario  
- ✅ **HU3**: Gestión de productos y clientes
- ✅ **HU4**: Gestión de pedidos y validaciones
- ✅ **HU5**: Calidad, seguridad y despliegue

**Proyecto completado al 100%** 🎉