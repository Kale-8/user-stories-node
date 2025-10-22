# Use a slim Node image
FROM node:20-slim AS base

WORKDIR /app

# Install dependencies first (leverage Docker layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Build stage for TS
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime image
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN groupadd -r nodeapp && useradd -r -g nodeapp nodeapp

# Copy node_modules from base and dist from build
COPY --from=base /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=build /app/dist ./dist

USER nodeapp
EXPOSE 3000
CMD [node, dist/index.js]
