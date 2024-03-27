FROM node:20-alpine3.18

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
