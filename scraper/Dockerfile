FROM node:17
WORKDIR /scraper

COPY package-lock.json .
COPY package.json .
RUN npm ci

RUN npm install -g nodemon
COPY . .
RUN npm run build

ENTRYPOINT ./entrypoint.sh