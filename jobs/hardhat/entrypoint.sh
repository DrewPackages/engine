#!/bin/sh

cp -r /project/. /app
if [[ -n $HH_WORKDIR ]]; then
    cd /app/$HH_WORKDIR
fi
rm -rf ./package-lock.json ./node_modules && npm i
npx hardhat $@