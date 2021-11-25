const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const fs = require("fs");
const { prefix, token } = require("./config.json");
let db = require("./db")
/* Temporary Database */
db = db.quizzes[0]
/* Temporary Database */

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("The client is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "select") {
    await interaction.update({
      content: `You chose ${interaction.values[0]}`,
      components: [],
    });
  }
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    client.commands.get("ping").execute(message);
  }

  if (command === "createquiz") {
    client.commands.get("createquiz").execute(message, args);
  }

  if (message.content === "!takequiz") {
    let questions = [];
    let rows = [];
    let counter = 0;
    let labels = ["A", "B", "C", "D"];

    for(let i = 0; i < db.questions.data.length; i++) {
      questions.push(db.questions.data[i].text);
      let tempArr = [];

      for(let j = 0; j < db.questions.data[i].answers.data.length; j++) {
        let tempObj = {
          label: labels[j],
        };
          tempObj.description = db.questions.data[i].answers.data[j].text;
          tempObj.value = `Option ${j + 1}`;
          tempArr.push(tempObj);
      }
      rows.push(
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("Nothing selected")
            .addOptions(tempArr)
        )
      );
    }

    const collector = message.channel.createMessageComponentCollector({
      max: rows.length,
    });

    collector.on("collect", () => {
      if (counter < rows.length) {
        const count = counter++;
        message.channel.send({
          content: questions[count],
          components: [rows[count]],
        });
      }
    });

    collector.on("end", (collected) => {
      message.channel.send({
        content: `You have answered ${collected.size} questions`,
      });
    });

    const count = counter++;
    message.channel.send({
      content: questions[count],
      components: [rows[count]],
    });
  }
});

client.login(token);
