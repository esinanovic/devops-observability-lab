# BACKEND - Pour une API Node.js
#Stage 1 : installation toutes les dépendances à partir du package et de lock
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                

# Stage 2 : stage intermédiaire pour décanter les deps
FROM node:20-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Stage 3 : Production
FROM node:20-alpine 
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/ ./
COPY --from=builder /app/index.js /app/math.js ./

RUN chown -R nodejs:nodejs /app

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

USER nodejs
EXPOSE 3001
CMD ["node", "index.js"]