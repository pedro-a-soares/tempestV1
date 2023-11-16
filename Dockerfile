FROM node:18.16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.16
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
RUN npm run build
CMD ["node", "dist/src/app.js"]
