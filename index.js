const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const config = require("./config.json");
// const command = require("./command");

client.on("ready", () => {
  console.log("The client is ready!");

  // command(client, ["ping", "test"], (message) => {
  //   message.channel.send("Pong!");
  // });
});

client.on("message", async (message) => {
  const questions = [
    "What is your name?",
    "How old are you?",
    "What country are you from?",
  ];
  let counter = 0;

  const filter = (m) => m.author.id === message.author.id;

  if (message.content === "!hello") {
    message.channel.send(questions[counter++]);
    const collector = message.channel.createMessageCollector({
      filter,
      time: 1000 * 15, // 15s
      max: questions.length,
    });

    collector.on("collect", (msg) => {
      if (counter < questions.length) {
        msg.channel.send(questions[counter++]);
      }
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} messages`);

      if (collected.size < questions.length) {
        message.reply("You did not answer the questions in time.");
      }

      let counter = 0;
      collected.forEach((value) => {
        console.log(questions[counter++], value.content);
      });
    });
  }
});

client.login(config.token);
