# resources-app-4 — backend (express, generated scaffold)
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

USER node

CMD ["node", "src/server.js"]
