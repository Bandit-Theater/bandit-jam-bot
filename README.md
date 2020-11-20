# bandit-jam-bot
A simple bot with various utilities to help run improv jams remotely on Discord.

Bandit Jam Bot listens to a server's text channels and responds to commands with scene suggestions and sound effects. For a full list of features, post "bot?" and Bandit Jam Bot will respond with a list of the commands it knows.

---

### Dependencies

* Node 13.10.1 and up
* libsodium
* ffmpeg

### Building

`npm install` will do the trick if all dependencies are satisfied.

A Dockerfile is also provided for building via Docker if installing the required dependencies is tedious or impossible on your platform. libsodium installation has caused some problems on OSX High Sierra, for example. The Docker build is straightforward and can be accomplished via `docker build .`

### Running

To access your Discord server, Bandit Jam Bot requires the token from your Discord Application's Bot user. Once you've created a [Discord Application](https://discord.com/developers/applications/) and a Bot, copy the Bot's token to `config.json` as follows:

```
{
  "token": "yourtokengoeshere"
}
```

Once complete, `node src/index.js` starts the bot. Check your console for confirmation that Bandit Jam Bot has successfully logged in.
