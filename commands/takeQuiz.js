const db = require("../db");

module.exports = {
  name: "takequiz",
  description: "take a poap quiz",
  execute(interaction, args) {
      const quizNumber = args[0];
      const quiz = db.quizzes[quizNumber]
      let correctSum = 0;

      const filter = (msg) => !msg.author.bot;

      if(quiz.links.count === quiz.links.data.length - 1) {
        interaction.channel.send("Sorry, all codes have been claimed...");
        return;
      }

      interaction.channel.send(`Did you want to take ${quiz.name}? (yes/no)`)
      .then(() => {
        return interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        });
      })
      .then(async(collected) => {
        collected = collected.first().content.toLowerCase();
        if(collected.indexOf("no") > -1) return;
        for (let i = 0; i < quiz.questions.data.length; i++) {
            await interaction.channel.send(quiz.questions.data[i].text);
            collected = await interaction.channel.awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            });
            collected = collected.first().content.toLowerCase();

            if(quiz.questions.data[i].correctAnswer.text === collected){
                correctSum++
            }
        }
        if(correctSum === quiz.questions.data.length) {
            quiz.links.count++;
            interaction.channel.send(`Perfect! Here is the link for your POAP: ${quiz.links.data[quiz.links.count] - 1}`);
        }
        else {
            interaction.channel.send(`Your score was ${correctSum} / ${quiz.questions.data.length}. Please try again.`);
        }
      })
  }
};
