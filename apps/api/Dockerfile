FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build --prefix apps/api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/src/modules/agents/agents/prompts ./dist/modules/agents/agents/prompts
EXPOSE 3000
CMD ["node", "dist/main.js"]
