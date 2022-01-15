const fetch = require("node-fetch");
const { saveQuiz } = require("../database/mongoose");

class Quiz {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.questions = [];
    this.links;
  }

  addLinks(text) {
    text = text.split(/\n/).filter((el) => el.indexOf("http") !== -1);
    this.links = text;
  }

  addQuestion(data) {
    this.questions.push(data);
  }
}

class Question {
  constructor(description) {
    this.description = description;
    this.answers = [];
  }

  addAnswer(answer) {
    answer.includes("$")
      ? this.answers.push({
          text: answer.substring(2),
          isCorrect: true,
        })
      : this.answers.push({
          text: answer.substring(1),
          isCorrect: false,
        });
  }
}

module.exports = {
  name: "createquiz",
  execute(msg) {
    //let quiz = {};
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

    function addLinks(quiz) {
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
              quiz.addLinks(text);
              console.log(quiz);
            }
          } catch (error) {
            console.log(error);
          }
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
              let quizFile = text.split(/\n/);

              const quiz = new Quiz(quizFile[0], quizFile[1]);

              for (let i = 3; i < quizFile.length - 1; i++) {
                if (quizFile[i].includes("#")) {
                  question = new Question(quizFile[i].substring(1));
                }
                quizFile[i].includes("*") && question.addAnswer(quizFile[i]);
                quizFile[i].includes("//") && quiz.addQuestion(question);
              }
              addLinks(quiz);
              saveQuiz(quiz);
            }
          } catch (error) {
            console.log(error);
          }
        });

      // function quizWizard() {
      //   let questionNum = 0;
      //   let answerNum = 0;

      //   msg.channel
      //     .send("How many questions are there?")
      //     .then(() => {
      //       return msg.channel.awaitMessages({
      //         filter,
      //         max: 1,
      //         time: 30000,
      //         errors: ["time"],
      //       });
      //     })
      //     .then((collected) => {
      //       collected = collected.first();
      //       questionNum = collected.content;

      //       msg.channel.send("How many answers per question?");
      //     })
      //     .then(() => {
      //       return msg.channel.awaitMessages({
      //         filter,
      //         max: 1,
      //         time: 30000,
      //         errors: ["time"],
      //       });
      //     })
      //     .then((collected) => {
      //       collected = collected.first();
      //       answerNum = collected.content;

      //       msg.channel.send("What is the name of the quiz?");
      //     })
      //     .then(() => {
      //       return msg.channel.awaitMessages({
      //         filter,
      //         max: 1,
      //         time: 30000,
      //         errors: ["time"],
      //       });
      //     })
      //     .then((collected) => {
      //       collected = collected.first();
      //       quiz.name = collected.content;

      //       msg.channel.send("Give a brief description of the quiz.");
      //     })
      //     .then(() => {
      //       return msg.channel.awaitMessages({
      //         filter,
      //         max: 1,
      //         time: 30000,
      //         errors: ["time"],
      //       });
      //     })
      //     .then((collected) => {
      //       collected = collected.first();
      //       quiz.description = collected.content;
      //     })
      //     .then(async () => {
      //       quiz.questions = {
      //         data: [],
      //       };
      //       // loop through the creation of each question up the specified amount
      //       for (let i = 0; i < questionNum; i++) {
      //         await msg.channel.send(`What is the question #${i + 1}?`);
      //         collected = await msg.channel.awaitMessages({
      //           filter,
      //           max: 1,
      //           time: 30000,
      //           errors: ["time"],
      //         });
      //         collected = collected.first();
      //         quiz.questions.data.push({
      //           text: collected.content,
      //           answers: { data: [] },
      //         });
      //         // loop through the creation of each answer the specified amount
      //         for (let j = 0; j < answerNum; j++) {
      //           await msg.channel.send(`What #${j + 1} answer option?`);
      //           collected = await msg.channel.awaitMessages({
      //             filter,
      //             max: 1,
      //             time: 30000,
      //             errors: ["time"],
      //           });
      //           collected = collected.first();
      //           quiz.questions.data[i].answers.data.push({
      //             text: collected.content,
      //           });
      //           await msg.channel.send("Is it true?(yes/no)");
      //           collected = await msg.channel.awaitMessages({
      //             filter,
      //             max: 1,
      //             time: 30000,
      //             errors: ["time"],
      //           });
      //           collected = collected.first();
      //           quiz.questions.data[i].correctAnswer = {
      //             text: quiz.questions.data[i].answers.data[j].text,
      //           };
      //         }
      //       }
      //     })
      //     .then(() => {
      //       addLinks();
      //     });
      // }
    }
  },
};
