FROM node:alpine

WORKDIR /app

COPY ./package-*.json /app/

RUN npm i

ENV PORT=3000 \ 
	USERS_DB_URL=mongodb://localhost/foods_db