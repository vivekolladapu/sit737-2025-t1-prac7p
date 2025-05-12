FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 3020

CMD ["node", "server.js"]
