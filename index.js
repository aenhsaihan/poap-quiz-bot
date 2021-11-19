const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const config = require("./config.json");

client.on("ready", () => {
  console.log("The client is ready!");
});

client.login(config.token);
