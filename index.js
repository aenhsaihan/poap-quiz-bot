const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const fs = require("fs");
const { prefix, token } = require("./config.json");

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

client.on("message", (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    client.commands.get("ping").execute(msg);
  }

  if (command === "createquiz") {
    if (!args.length) {
      return msg.channel.send(
        `You didn't provide any arguments, ${msg.author}!`
      );
    }

    client.commands.get("createquiz").execute(msg, args);
  }
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
  const questions = [
    "Who invented Ethereum?",
    "What programming language is used for ETH smart contracts?",
  ];

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions([
        {
          label: "A",
          description: "Satoshi Nakamoto",
          value: "first_option",
        },
        {
          label: "B",
          description: "Vitalik Buterin",
          value: "second_option",
        },
      ])
  );

  const row2 = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions([
        {
          label: "A",
          description: "Solidity",
          value: "first_option",
        },
        {
          label: "B",
          description: "JavaScript",
          value: "second_option",
        },
      ])
  );

  const rows = [row, row2];

  let counter = 0;

  if (message.content === "!hello") {
    const collector = message.channel.createMessageComponentCollector({
      max: rows.length,
    });

    collector.on("collect", (i) => {
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
