const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "select") {
    await interaction.update({
      content: "Something was selected!",
      components: [],
    });
  }
});

client.on("message", async (message) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions([
        {
          label: "Select me",
          description: "This is a description",
          value: "first_option",
        },
        {
          label: "You can select me too",
          description: "This is also a description",
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
          label: "another quiz question",
          description: "This is a description",
          value: "first_option",
        },
        {
          label: "nother quiz question",
          description: "This is also a description",
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
        message.channel.send({
          content: "Pong!!!",
          components: [rows[counter++]],
        });
      }
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} interactions.`);
    });

    message.channel.send({
      content: "Pong!",
      components: [rows[counter++]],
    });
  }
});

client.login(config.token);
