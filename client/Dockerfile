FROM node:12.6.0-buster
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
