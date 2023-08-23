FROM rabbitmq:3.12-management-alpine


COPY ./configuration/definitions.json /etc/rabbitmq/
COPY ./configuration/rabbitmq.conf /etc/rabbitmq/

CMD ["rabbitmq-server"]