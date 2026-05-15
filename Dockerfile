# Multi-stage build — keeps the runtime image small (distroless).
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN yarn install --frozen-lockfile || npm install
COPY src ./src
RUN yarn build || npx tsc

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["dist/index.js"]
