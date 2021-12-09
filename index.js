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

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  const filter = (message) => !message.author.bot;

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

    let index = 0;
    let correct = 0;

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

    client.on("interactionCreate", async (interaction) => {
      //if (!interaction.isSelectMenu()) return;
    
      if (interaction.customId === "select") {
        let answer = interaction.values[0];
        answer = answer.substring(7);
        console.log(db.questions.data[index].answers.data[answer - 1].text)
        console.log(db.questions.data[index].correctAnswer.text)
        if(db.questions.data[index].answers.data[answer - 1].text == db.questions.data[index].correctAnswer.text){
          correct++
        }
        await interaction.update({
          content: `You chose ${interaction.values[0]}`,
          components: [],
        });
      }

      if (counter < rows.length) {
        const count = counter++;
        message.channel.send({
          content: questions[count],
          components: [rows[count]],
        })
        index++;
      }
    });
    // collector.on("collect", () => {
    //   if (counter < rows.length) {
    //     const count = counter++;
    //     message.channel.send({
    //       content: questions[count],
    //       components: [rows[count]],
    //     })
    //     .then(async(collected) => {
    //       collected = await message.update({
    //         filter,
    //         max: 1,
    //         time: 30000,
    //         errors: ["time"],
    //       });
    //       console.log(collected)
    //     })
    //   }
    // });

    collector.on("end", (collected) => {
      console.log(index)
      console.log(correct)
      if(index + 1 === correct){
        db.links.count++;
        message.channel.send({
          content: `Perfect! Here is the link for your POAP: ${db.links.data[db.links.count]}`,
        });
      }
      else {
        message.channel.send(`Your score was ${correct} / ${db.questions.data.length}. Please try again.`);
      }
    });

    const count = counter++;
    message.channel.send({
      content: questions[count],
      components: [rows[count]],
    });
  }
});

client.login(token);
