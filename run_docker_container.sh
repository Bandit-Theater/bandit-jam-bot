#!/bin/bash

set -x

EPOCH_TIME=$(date +%s)
TAG=bandit-jam-bot:$EPOCH_TIME

docker build -t $TAG .

docker run -ti $TAG bash