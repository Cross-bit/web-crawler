FROM node:17
WORKDIR /vue
RUN npm i -g @quasar/cli
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
ENTRYPOINT quasar d