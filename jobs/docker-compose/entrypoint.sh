#!/bin/sh

cp -r /project/. /app
if [[ -n $DREW_WORKDIR ]]; then
    cd /app/$DREW_WORKDIR
fi
docker compose $@