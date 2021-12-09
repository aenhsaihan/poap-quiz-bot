const fetch = require("node-fetch");
const db = require("../db");

module.exports = {
  name: "createquiz",
  execute(msg) {
    let quiz = {};
    const filter = (msg) => !msg.author.bot;

    msg.channel
      .send("How would you like to create a quiz? (wizard/file)")
      .then(() => {
        return msg.channel.awaitMessages({
          max: 1,
          time: 30000,
          errors: ["time"],
        });
      })
      .then(async (collected) => {
        collected = collected.first().content.toLowerCase();
        if (collected === "wizard") {
          quizWizard();
        }
        if (collected === "file") {
          quizFile();
        }
      });

    function addLinks() {
      const quiz = db.quizzes[db.quizzes.length - 1];

      // get the file's URL
      msg.channel
        .send("Please send .txt file containing POAP links.")
        .then(() => {
          return msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
        })
        .then(async (collected) => {
          const file = collected.first().attachments.first()?.url;
          if (!file) return console.log("No attached file found");

          try {
            msg.channel.send("Reading the file! Fetching data...");

            // fetch the file from the external URL
            const response = await fetch(file);

            // if there was an error send a message with the status
            if (!response.ok)
              return msg.channel.send(
                "There was an error with fetching the file:",
                response.statusText
              );

            // take the response stream and read it to completion
            const text = await response.text();

            if (text) {
              links = text.split(/\n/);
              links = links.filter((el) => el.indexOf("http") !== -1);
              quiz.links = {
                data: links,
                count: 0,
              };
              /**DELETE THIS */
              console.log(JSON.stringify(quiz))
              msg.channel.send(
                `${quiz.links.data.length} POAP claim links added!`
              );
            }
          } catch (error) {
            console.log(error);
          }
        });
    }

    function quizWizard() {
      let questionNum = 0;
      let answerNum = 0;

      msg.channel
        .send("How many questions are there?")
        .then(() => {
          return msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
        })
        .then((collected) => {
          collected = collected.first();
          questionNum = collected.content;

          msg.channel.send("How many answers per question?");
        })
        .then(() => {
          return msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
        })
        .then((collected) => {
          collected = collected.first();
          answerNum = collected.content;

          msg.channel.send("What is the name of the quiz?");
        })
        .then(() => {
          return msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
        })
        .then((collected) => {
          collected = collected.first();
          quiz.name = collected.content;

          msg.channel.send("Give a brief description of the quiz.");
        })
        .then(() => {
          return msg.channel.awaitMessages({
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
            await msg.channel.send(`What is the question #${i + 1}?`);
            collected = await msg.channel.awaitMessages({
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
              await msg.channel.send(`What #${j + 1} answer option?`);
              collected = await msg.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ["time"],
              });
              collected = collected.first();
              quiz.questions.data[i].answers.data.push({
                text: collected.content,
              });
              await msg.channel.send("Is it true?(yes/no)");
              collected = await msg.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ["time"],
              });
              collected = collected.first();
              quiz.questions.data[i].correctAnswer = {
                text: quiz.questions.data[i].answers.data[j].text,
              };
            }
          }
        })
        .then(() => {
          db.quizzes.push(quiz);
          msg.channel.send("Quiz added to database!");
          addLinks();
        });
    }

    function quizFile() {
      msg.channel
        .send("Please send .txt file.")
        .then(() => {
          return msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ["time"],
          });
        })
        .then(async (collected) => {
          // get the file's URL
          const file = collected.first().attachments.first()?.url;
          if (!file) return console.log("No attached file found");

          try {
            msg.channel.send("Reading the file! Fetching data...");

            // fetch the file from the external URL
            const response = await fetch(file);

            // if there was an error send a message with the status
            if (!response.ok)
              return msg.channel.send(
                "There was an error with fetching the file:",
                response.statusText
              );

            // take the response stream and read it to completion
            const text = await response.text();

            if (text) {
              quizFile = text.split(/\n/);
              quiz.name = quizFile[0].replace("name: ", "");
              quiz.description = quizFile[1].replace("description: ", "");
              quiz.questions = {
                data: [],
              };
              for (let i = 2; i < quizFile.length; i++) {
                let j = i + 1;
                if (quizFile[i].indexOf("question") > -1) {
                  currentQuestion = quiz.questions.data.length;
                  quiz.questions.data.push({
                    text: quizFile[i].replace("question: ", ""),
                  });
                  quiz.questions.data[currentQuestion].answers = { data: [] };
                  while (quizFile[j]) {
                    if (quizFile[j].indexOf("correct") > -1) {
                      quizFile[j] = quizFile[j].replace(" - correct", "");
                      quiz.questions.data[currentQuestion].correctAnswer = {
                        text: quizFile[j],
                      };
                    }
                    quiz.questions.data[currentQuestion].answers.data.push({
                      text: quizFile[j],
                    });
                    j++;
                  }
                }
              }
              db.quizzes.push(quiz);
              console.log(JSON.stringify(quiz));
              msg.channel.send("Quiz added to database!");
              addLinks();
            }
          } catch (error) {
            console.log(error);
          }
        });
    }
  },
};
