
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci


COPY src/ ./src/
RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./src

#ENV Variables 
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=postgres
ENV DB_SCHEMA=public
ENV JWT_SECRET=default_secret
ENV JWT_EXPIRES_IN=3000

EXPOSE ${PORT}

CMD ["node", "src/startServer.js"]