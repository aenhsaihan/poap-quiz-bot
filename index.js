const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { prefix, token } = require("./config.json");

const api = require("./api");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("The client is ready!");
});

client.on("message", msg => {
  if(!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  if(command === 'ping') {
    client.commands.get('ping').execute(msg);
  }

  if(command === 'createquiz') {
    if (!args.length) {
			return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
    }
    
    client.commands.get('createquiz').execute(msg, args);
  }

});

client.login(token);

api.createQuiz().then((res) => console.log(res));
