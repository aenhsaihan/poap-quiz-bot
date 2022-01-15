const Quiz = require("./schema/quiz");

// to fetch quiz
const fetchQuiz = async function (data) {
  return await Quiz.findOne({ title: data });
};

const saveQuiz = async function (data) {
  Quiz.create(data)
    .then(() => {
      return "Success! Quiz added to database.";
    })
    .catch((e) => console.log(e));
};

module.exports = { saveQuiz, fetchQuiz };
