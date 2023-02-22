FROM hasura/graphql-engine:v2.15.2

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y jq

RUN curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash

COPY . .

ENTRYPOINT ./entrypoint.sh