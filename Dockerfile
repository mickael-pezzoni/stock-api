FROM node:16.14.2-alpine
WORKDIR /app
COPY . .
COPY package*.json ./
RUN npm i
COPY . .