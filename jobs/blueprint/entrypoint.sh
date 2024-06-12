#!/bin/sh

cp -r /project/. /app
if [[ -n $DREW_WORKDIR ]]; then
    cd /app/$DREW_WORKDIR
fi
rm -rf ./package-lock.json ./node_modules && npm i
npx blueprint $@