module.exports = {
  name: "createquiz",
  description: "create a poap quiz",
  execute(interaction, args) {
    // define variables
    let questionNum = args[0];
    let answerNum = args[1];
    let quiz = {};
    const filter = (msg) => !msg.author.bot;

    interaction.channel
      .send("What is the name of the quiz?")
      .then(() => {
        return interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        });
      })
      .then((collected) => {
        collected = collected.first();
        quiz.name = collected.content;

        interaction.channel.send("Give a brief description of the quiz.");
      })
      .then(() => {
        return interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        });
      })
      .then((collected) => {
        collected = collected.first();
        quiz.description = collected.content;
      })
      .then(async () => {
        quiz.questions = {
          data: [],
        };
        // loop through the creation of each question up the specified amount
        for (let i = 0; i < questionNum; i++) {
          await interaction.channel.send(`What is the question #${i + 1}?`);
          collected = await interaction.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
          collected = collected.first();
          quiz.questions.data.push({
            text: collected.content,
            answers: { data: [] },
          });
          // loop through the creation of each answer the specified amount
          for (let j = 0; j < answerNum; j++) {
            await interaction.channel.send(`What #${j + 1} answer option?`);
            collected = await interaction.channel.awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            });
            collected = collected.first();
            quiz.questions.data[i].answers.data.push({
              text: collected.content,
            });
            await interaction.channel.send("Is it true?(yes/no)");
            collected = await interaction.channel.awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            });
            collected = collected.first();
            quiz.questions.data[i].answers.data[j].isCorrect =
              collected.content.indexOf("yes") > -1 ? true : false;
          }
        }
      })
      .then(() => {
        console.log(quiz);
        return quiz;
      });
  },
};
