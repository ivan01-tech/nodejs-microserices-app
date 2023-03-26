FROM node:alpine

WORKDIR /app

COPY ./package-*.json /app/

RUN npm i

COPY . /app/

ENV PORT=3000 	USERS_DB_URL=mongodb://localhost/clients_db

EXPOSE 3000

CMD [ "node" "server.js" ]