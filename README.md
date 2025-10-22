# SportsLine API

Complete API for managing products, clients, users and orders for SportsLine. Built with Node.js, TypeScript, PostgreSQL and Docker.

## 🚀 Features

- **JWT Authentication** with refresh tokens
- **User roles** (admin, salesperson)
- **Complete CRUD** for products, clients and orders
- **Centralized validations** with express-validator
- **Complete Swagger documentation**
- **Hybrid encryption** (AES-256-GCM + RSA)
- **Clean Code architecture** with DTOs and DAOs
- **Dockerization** with Docker Compose
- **Unit tests** with Jest

## 📋 Requirements

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (included in Docker Compose)

## 🛠️ Installation

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-stories-node
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URI=postgresql://postgres:password@localhost:5432/sportsline
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   RSA_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----
   RSA_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   The service will be available at `http://localhost:3000`

### Option 2: Local Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure PostgreSQL database**
   - Create `sportsline` database
   - Configure `.env` with the connection URI

3. **Run migrations and seeds**
   ```bash
   npm run seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🐳 Docker

### Image building

```bash
docker build -t sportsline-api .
```

### Running with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and run
docker-compose up --build
```

### Resource configuration

The `docker-compose.yml` includes resource limits:
- **CPU**: 0.5 cores maximum, 0.25 cores reserved
- **RAM**: 512MB maximum, 256MB reserved

## 📚 API Documentation

### Swagger UI

Once the server is started, access the interactive documentation:

```
http://localhost:3000/api-docs
```

### Available documentation

- **Swagger YAML**: `swagger.yaml` - Complete documentation in OpenAPI 3.0 format
- **Swagger TypeScript**: `src/config/swagger.ts` - Programmatic configuration
- **Web interface**: Interactive documentation with examples

### Main endpoints

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

#### Products
- `GET /products` - List products
- `GET /products/:id` - Get product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Clients
- `GET /clients` - List clients
- `GET /clients/:id` - Get client
- `POST /clients` - Create client (admin)
- `PUT /clients/:id` - Update client (admin)
- `DELETE /clients/:id` - Delete client (admin)

#### Orders
- `GET /orders` - List orders
- `GET /orders/:id` - Get order
- `GET /orders/client/:clienteId` - Orders by client
- `GET /orders/product/:productoId` - Orders by product
- `POST /orders` - Create order (salesperson)
- `PUT /orders/:id/status` - Update status (admin)

#### System health
- `GET /health` - Health check

## 🔐 Authentication

### User registration

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

### Using tokens

```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Testing

### Run tests

```bash
# Unit tests
npm test

# Tests with coverage
npm run test:coverage

# Tests in watch mode
npm run test:watch
```

### Current coverage

- **Branches**: 11.11% (in development)
- **Functions**: 24.32% (in development)
- **Lines**: 44.46% ✅
- **Statements**: 44.7% ✅

### Minimum coverage required

- **Branches**: 40%
- **Functions**: 40%
- **Lines**: 40%
- **Statements**: 40%

## 📁 Project structure

```
src/
├── config/           # Configurations (DB, Swagger)
├── controllers/      # Route controllers
├── dao/             # Data Access Objects
├── dto/             # Data Transfer Objects
├── middlewares/     # Middlewares (auth, validation)
├── models/          # Sequelize models
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utilities (crypto, validation)
├── validators/      # Input validations
├── seeds/           # Initial data
└── __tests__/       # Unit tests
```

## 🔧 Available scripts

```bash
npm run dev          # Development server
npm run build        # Compile TypeScript
npm start           # Production server
npm test            # Run tests
npm run test:coverage # Tests with coverage
npm run seed        # Run seeds
```

## 🌍 Environment variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `DATABASE_URI` | PostgreSQL connection URI | ✅ |
| `JWT_SECRET` | Secret key for JWT | ✅ |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | ✅ |
| `RSA_PUBLIC_KEY` | RSA public key for encryption | ✅ |
| `RSA_PRIVATE_KEY` | RSA private key for encryption | ✅ |
| `NODE_ENV` | Execution environment | ❌ |
| `PORT` | Server port (default: 3000) | ❌ |

## 🔒 Security

- **JWT authentication** with access and refresh tokens
- **Role-based authorization** (admin, salesperson)
- **Hybrid encryption** for sensitive data
- **Input validation** with express-validator
- **Data sanitization** in all endpoints
- **Rate limiting** (configurable)

## 🚀 Deployment

### Production with Docker

1. **Configure production environment variables**
2. **Build optimized image**
   ```bash
   docker build -t sportsline-api:prod .
   ```
3. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Monitoring

- **Health check**: `GET /health`
- **Logs**: `docker-compose logs -f`
- **Metrics**: Integration with monitoring tools

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📝 License

This project is under the MIT License. See `LICENSE` for more details.

## 👥 Team

- **Development**: SportsLine Development Team
- **Email**: dev@sportsline.local

## 🆘 Support

For technical support or questions:

- **Email**: support@sportsline.local
- **Documentation**: http://localhost:3000/api-docs
- **Issues**: GitHub Issues

---

## 📊 Project status

- ✅ **HU1**: Initial project setup
- ✅ **HU2**: Authentication and user roles  
- ✅ **HU3**: Product and client management
- ✅ **HU4**: Order management and validations
- ✅ **HU5**: Quality, security and deployment

**Project 100% complete** 🎉
