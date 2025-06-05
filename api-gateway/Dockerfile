FROM node:20-alpine

WORKDIR /apigateway/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]