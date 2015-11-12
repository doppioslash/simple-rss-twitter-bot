FROM ubuntu:latest
MAINTAINER Claudia Doppioslash <claudia.doppioslash@gmail.com>

# Install base packages
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install nodejs npm git -y

# Install nodebb
RUN cd /opt && git clone https://github.com/doppioslash/simple-rss-twitter-bot.git twitterbot
RUN cd /opt/twitterbot && npm install --production

# Create a mountable volume
VOLUME /opt/twitterbot

# Define working directory.
WORKDIR /opt/twitterbot

# Expose ports
EXPOSE 5693

# Define default command.
COPY config.json ./
CMD node app.js
