FROM node:13.10.1-stretch

# Install dependencies for...
#   1. Sodium
#   2. Devtools
RUN apt-get update && \
    apt-get install -y libtool autoconf automake ffmpeg && \
    apt-get install -y vim

# Install our NPM dependencies
ADD ./package.json /bandit/
WORKDIR /bandit/
RUN npm install

# Add our source to the working directory
ADD ./ ./