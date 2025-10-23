# SportsLine API - Deployment Guide

## 🚀 Docker Deployment

### 1. Environment Setup

#### Production environment variables
```bash
# Create .env file for production
cp .env.example .env.prod

# Configure production variables
DATABASE_URI=postgresql://postgres:secure_password@db:5432/sportsline_prod
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_for_production
NODE_ENV=production
PORT=3000
```

#### Generate RSA keys
```bash
# Generate RSA key pair for production
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

### 2. Docker Compose Deployment

#### Development
```bash
# Start development services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### 3. Resource Configuration

#### Development (docker-compose.yml)
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

#### Production (docker-compose.prod.yml)
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

### Image Building
```bash
# Build image
docker build -t sportsline-api .

# Build with specific tag
docker build -t sportsline-api:v1.0.0 .

# Build without cache
docker build --no-cache -t sportsline-api .
```

### Container Execution
```bash
# Run container
docker run -d \
  --name sportsline-api \
  -p 3000:3000 \
  --env-file .env \
  sportsline-api

# Run with logs
docker run -it --rm \
  --name sportsline-api \
  -p 3000:3000 \
  --env-file .env \
  sportsline-api
```

### Container Management
```bash
# View running containers
docker ps

# View logs
docker logs sportsline-api

# Stop container
docker stop sportsline-api

# Remove container
docker rm sportsline-api

# Execute command in container
docker exec -it sportsline-api sh
```

## 🌐 Cloud Deployment

### AWS ECS

#### 1. Create task definition
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

#### 2. Deploy service
```bash
# Create cluster
aws ecs create-cluster --cluster-name sportsline-cluster

# Create service
aws ecs create-service \
  --cluster sportsline-cluster \
  --service-name sportsline-api \
  --task-definition sportsline-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

### Google Cloud Run

#### 1. Build and upload image
```bash
# Configure project
gcloud config set project your-project-id

# Build image
gcloud builds submit --tag gcr.io/your-project-id/sportsline-api

# Deploy service
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

#### 1. Deploy container
```bash
# Create resource group
az group create --name sportsline-rg --location eastus

# Deploy container
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

## 🔒 Production Security

### 1. Secure environment variables
```bash
# Use Docker secrets
docker run -d \
  --name sportsline-api \
  -p 3000:3000 \
  --secret source=db_password,target=/run/secrets/db_password \
  sportsline-api
```

### 2. HTTPS/TLS
```bash
# Use reverse proxy with SSL
docker run -d \
  --name nginx-proxy \
  -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy
```

### 3. Monitoring and logging
```bash
# Use ELK stack for logs
docker-compose -f docker-compose.monitoring.yml up -d
```

## 📊 Monitoring

### Health Checks
```bash
# Check service health
curl -f http://localhost:3000/health

# Health check with Docker
docker exec sportsline-api curl -f http://localhost:3000/health
```

### Metrics
```bash
# Install monitoring tools
npm install --save prom-client

# Configure metrics
const promClient = require('prom-client');
const register = new promClient.Registry();

// Metrics endpoint
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

### Common Issues

#### 1. Database connection error
```bash
# Check connectivity
docker exec sportsline-api ping db

# Check environment variables
docker exec sportsline-api env | grep DATABASE
```

#### 2. Memory error
```bash
# Increase memory limit
docker run -d \
  --name sportsline-api \
  --memory=2g \
  --memory-swap=2g \
  sportsline-api
```

#### 3. CPU error
```bash
# Increase CPU limit
docker run -d \
  --name sportsline-api \
  --cpus=2 \
  sportsline-api
```

### Debugging logs
```bash
# View detailed logs
docker logs --tail 100 -f sportsline-api

# Logs with timestamps
docker logs --timestamps -f sportsline-api
```

## 📈 Scalability

### Horizontal scaling
```bash
# Scale service
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
# Increase resources
docker run -d \
  --name sportsline-api \
  --cpus=4 \
  --memory=4g \
  sportsline-api
```
