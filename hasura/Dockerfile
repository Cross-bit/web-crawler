FROM hasura/graphql-engine:v2.3.1
RUN apt-get update
RUN apt-get install -y curl
COPY . .
ENTRYPOINT ./entrypoint.sh