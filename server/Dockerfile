FROM node:latest as build

WORKDIR /app/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
