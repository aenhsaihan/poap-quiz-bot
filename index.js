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

  const rows = [row, row2];

  if (message.content === "!hello") {
    await message.channel.send({
      content: "Pong!",
      components: [rows.shift()],
    });
  }
});

client.login(config.token);
