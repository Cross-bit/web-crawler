FROM node:17 as development

WORKDIR /usr/src/app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY . .

RUN npm run build

#CMD ["npm", "run", "dev"]

CMD ["node", "build/index.js"]