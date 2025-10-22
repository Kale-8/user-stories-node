# SportsLine API - Guía de Despliegue

## 🚀 Despliegue con Docker

### 1. Preparación del entorno

#### Variables de entorno de producción
```bash
# Crear archivo .env para producción
cp .env.example .env.prod

# Configurar variables de producción
DATABASE_URI=postgresql://postgres:secure_password@db:5432/sportsline_prod
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_for_production
NODE_ENV=production
PORT=3000
```

#### Generar claves RSA
```bash
# Generar par de claves RSA para producción
node -e "
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
console.log('RSA_PUBLIC_KEY=' + publicKey);
console.log('RSA_PRIVATE_KEY=' + privateKey);
"
```

### 2. Despliegue con Docker Compose

#### Desarrollo
```bash
# Iniciar servicios de desarrollo
docker-compose up --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

#### Producción
```bash
# Usar configuración de producción
docker-compose -f docker-compose.prod.yml up -d

# Ver logs de producción
docker-compose -f docker-compose.prod.yml logs -f

# Detener servicios de producción
docker-compose -f docker-compose.prod.yml down
```

### 3. Configuración de recursos

#### Desarrollo (docker-compose.yml)
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: '512M'
    reservations:
      cpus: '0.25'
      memory: '256M'
```

#### Producción (docker-compose.prod.yml)
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: '1G'
    reservations:
      cpus: '0.5'
      memory: '512M'
```

## 🐳 Docker Commands

### Construcción de imagen
```bash
# Construir imagen
docker build -t sportsline-api .

# Construir con tag específico
docker build -t sportsline-api:v1.0.0 .

# Construir sin cache
docker build --no-cache -t sportsline-api .
```

### Ejecución de contenedor
```bash
# Ejecutar contenedor
docker run -d \
  --name sportsline-api \
  -p 3000:3000 \
  --env-file .env \
  sportsline-api

# Ejecutar con logs
docker run -it --rm \
  --name sportsline-api \
  -p 3000:3000 \
  --env-file .env \
  sportsline-api
```

### Gestión de contenedores
```bash
# Ver contenedores en ejecución
docker ps

# Ver logs
docker logs sportsline-api

# Detener contenedor
docker stop sportsline-api

# Eliminar contenedor
docker rm sportsline-api

# Ejecutar comando en contenedor
docker exec -it sportsline-api sh
```

## 🌐 Despliegue en la Nube

### AWS ECS

#### 1. Crear task definition
```json
{
  "family": "sportsline-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "sportsline-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/sportsline-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:sportsline/database"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/sportsline-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 2. Desplegar servicio
```bash
# Crear cluster
aws ecs create-cluster --cluster-name sportsline-cluster

# Crear servicio
aws ecs create-service \
  --cluster sportsline-cluster \
  --service-name sportsline-api \
  --task-definition sportsline-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

### Google Cloud Run

#### 1. Construir y subir imagen
```bash
# Configurar proyecto
gcloud config set project your-project-id

# Construir imagen
gcloud builds submit --tag gcr.io/your-project-id/sportsline-api

# Desplegar servicio
gcloud run deploy sportsline-api \
  --image gcr.io/your-project-id/sportsline-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

### Azure Container Instances

#### 1. Desplegar contenedor
```bash
# Crear grupo de recursos
az group create --name sportsline-rg --location eastus

# Desplegar contenedor
az container create \
  --resource-group sportsline-rg \
  --name sportsline-api \
  --image your-registry.azurecr.io/sportsline-api:latest \
  --dns-name-label sportsline-api \
  --ports 3000 \
  --environment-variables NODE_ENV=production \
  --cpu 1 \
  --memory 1
```

## 🔒 Seguridad en Producción

### 1. Variables de entorno seguras
```bash
# Usar secretos de Docker
docker run -d \
  --name sportsline-api \
  -p 3000:3000 \
  --secret source=db_password,target=/run/secrets/db_password \
  sportsline-api
```

### 2. HTTPS/TLS
```bash
# Usar reverse proxy con SSL
docker run -d \
  --name nginx-proxy \
  -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy
```

### 3. Monitoreo y logging
```bash
# Usar ELK stack para logs
docker-compose -f docker-compose.monitoring.yml up -d
```

## 📊 Monitoreo

### Health Checks
```bash
# Verificar salud del servicio
curl -f http://localhost:3000/health

# Health check con Docker
docker exec sportsline-api curl -f http://localhost:3000/health
```

### Métricas
```bash
# Instalar herramientas de monitoreo
npm install --save prom-client

# Configurar métricas
const promClient = require('prom-client');
const register = new promClient.Registry();

// Endpoint de métricas
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t sportsline-api:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          docker tag sportsline-api:${{ github.sha }} your-registry/sportsline-api:latest
          docker push your-registry/sportsline-api:latest
      
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
```

## 🚨 Troubleshooting

### Problemas comunes

#### 1. Error de conexión a base de datos
```bash
# Verificar conectividad
docker exec sportsline-api ping db

# Verificar variables de entorno
docker exec sportsline-api env | grep DATABASE
```

#### 2. Error de memoria
```bash
# Aumentar límite de memoria
docker run -d \
  --name sportsline-api \
  --memory=2g \
  --memory-swap=2g \
  sportsline-api
```

#### 3. Error de CPU
```bash
# Aumentar límite de CPU
docker run -d \
  --name sportsline-api \
  --cpus=2 \
  sportsline-api
```

### Logs de debugging
```bash
# Ver logs detallados
docker logs --tail 100 -f sportsline-api

# Logs con timestamps
docker logs --timestamps -f sportsline-api
```

## 📈 Escalabilidad

### Horizontal scaling
```bash
# Escalar servicio
docker-compose up --scale app=3

# Load balancer
docker run -d \
  --name nginx-lb \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

### Vertical scaling
```bash
# Aumentar recursos
docker run -d \
  --name sportsline-api \
  --cpus=4 \
  --memory=4g \
  sportsline-api
```
