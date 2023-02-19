FROM hasura/graphql-engine:v2.3.1

WORKDIR /usr/src/app/hasura

RUN apt-get update
RUN apt-get install -y curl

COPY . .

ENTRYPOINT ./entrypoint.sh