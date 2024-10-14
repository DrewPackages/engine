#!/bin/sh

cp -r /project/. /app
if [[ -n $DREW_WORKDIR ]]; then
    cd /app/$DREW_WORKDIR
fi
DC_P_OPS=
if [[ -n $DOCKER_COMPOSE_PROJECT_NAME ]]; then
    DC_P_OPS="-p $DOCKER_COMPOSE_PROJECT_NAME"
fi
docker compose $DC_P_OPS $@