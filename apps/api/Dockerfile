FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build --prefix apps/api

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/src/modules/agents/agents/prompts ./dist/modules/agents/agents/prompts
COPY --from=builder /app/apps/api/prisma ./prisma
EXPOSE 3000
CMD npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main.js
