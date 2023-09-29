FROM node:17 as development

WORKDIR /usr/src/app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "build/index.js"]
