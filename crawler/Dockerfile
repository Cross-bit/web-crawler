FROM node:17 as development

WORKDIR /usr/src/app

RUN mkdir testDir

# install cmake for crawler_engine build
RUN apt-get update
RUN apt-get install -y build-essential cmake

COPY package-lock.json .
COPY package.json .

RUN npm ci

# copy crawler_engine only
COPY crawler_engine ./crawler_engine

RUN rm -rf ./crawler_engine/build
RUN mkdir ./crawler_engine/build
RUN cmake -S ./crawler_engine -B ./crawler_engine/build
RUN make -C ./crawler_engine/build/

# move binaries to bin directory
RUN mkdir ./bin
RUN cp crawler_engine/build/crawler_engine ./bin

# copy and build rest of node js application
COPY . .

RUN npm run build


# run app in dev(=> with hot reload tools etc.)
#RUN npm run dev

FROM node:17 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package-lock.json .
COPY package.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/build ./build
COPY --from=development /usr/src/app/bin ./bin

CMD ["node", "build/index.js"]