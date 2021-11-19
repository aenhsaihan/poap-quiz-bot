const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

const api = require("./api");

const config = require("./config.json");
const command = require("./command");

client.on("ready", () => {
  console.log("The client is ready!");

  command(client, ["ping", "test"], (message) => {
    message.channel.send("Pong!");
  });
});

client.login(config.token);

api.createQuiz().then((res) => console.log(res));
