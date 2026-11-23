# Multi-stage Dockerfile for SuperMind AI Backend (Production Hardened)
# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies if native addons are needed
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated Prisma client and compiled application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create directory for file uploads and set ownership to unprivileged user 'node'
RUN mkdir -p /app/uploads && chown -R node:node /app

# Run as unprivileged user
USER node

EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/src/main.js"]
