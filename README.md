# simple-rss-twitter-bot

### Description

This is a simple bot, that will grab an RSS feed and post every new article from it as a tweet.
It's based on [rss-twitter-bot](https://gitlab.com/hughr/rss-twitter-bot). I added a configuration file, and if I can make it work deployment on Docker.

### Instructions

1. create the account you want to tweet from on twitter
2. create a twitter app
3. copy the default-config.json to config.json
4. fill in the data
5. run `node app.js`

### Deploy with Docker
You'll need a private docker repo, or your app's keys will be visible to the world.

1. as above, fill in the config file, make sure it's in the same dir as the rest
2. `docker build -t <yourname>/<apprepo>:<tag> .`
3. `docker push <yourname>/<apprepo>`
4. then on the remote server `docker login`
5. `docker pull <yourname>/<apprepo>`
6. `docker run --name <yourcontainername> -p 5693:5693 -P -t -i <yourname>/<apprepo>:<tag>`

That should do it. You may want to run it detached.
