#!/bin/bash

set -x

EPOCH_TIME=$(date +%s)
TAG=bandit-jam-bot:$EPOCH_TIME

docker build -t $TAG .

# Run the docker container but mount this directory as the working directory. This enables
# development locally with testing in Docker.
docker run -v $PWD:/bandit/ -ti $TAG bash