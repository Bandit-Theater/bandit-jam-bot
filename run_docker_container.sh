#!/bin/bash

# If "--dev" is provided, mount local /src and /sfx directories as external volumes for the
# Docker container. This is just to make development a little bit easier.
[[ $1 == "--dev" ]] && DEVELOPMENT=true || DEVELOPMENT=false

EPOCH_TIME=$(date +%s)
TAG=bandit-jam-bot:$EPOCH_TIME

docker build -t $TAG .

if [ $DEVELOPMENT ]; then
  docker run -v $PWD/src:/bandit/src -v $PWD/sfx:/bandit/sfx -ti $TAG bash
else
  docker run -ti $TAG bash
fi