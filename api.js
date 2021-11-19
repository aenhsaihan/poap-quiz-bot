const { GraphQLClient, gql } = require("graphql-request");

const client = new GraphQLClient("http://localhost:8080/v1/graphql");

const getQuizById = async (quizId) => {
  const query = gql`
    query MyQuery($quizId: Int!) {
      quizzes_by_pk(id: $quizId) {
        name
        description
        questions {
          text
          answers {
            text
          }
        }
      }
    }
  `;
  return client.request(query, { quizId }).then((res) => res.quizzes_by_pk);
};

/**
 * Gets an unused poap token url that the user can use to claim the token.
 * Sets the used flag to true for the return url.
 * @param quizId
 * @returns {Promise<void>}
 */
const getPoapTokenUrlForQuiz = async (quizId) => {
  const query = gql`
    mutation Test($quizId: Int!) {
      GetPoapClaimUrl(quizId: $quizId) {
        poapClaimUrl
      }
    }
  `;

  return client
    .request(query, { quizId })
    .then((res) => res.GetPoapClaimUrl.poapClaimUrl);
};

// This is an example input object for creating a quiz
const createQuizExampleInput = {
  name: "testname",
  description: "test description",
  questions: {
    data: [
      {
        text: "test question",
        answers: {
          data: [
            {
              text: "answer a",
              is_correct: true,
            },
            {
              text: "answer b",
              is_correct: false,
            },
          ],
        },
      },
    ],
  },
};

const createQuiz = async (quiz = createQuizExampleInput) => {
  const query = gql`
    mutation ($quiz: quizzes_insert_input!) {
      insert_quizzes_one(object: $quiz) {
        id
      }
    }
  `;

  return client.request(query, { quiz }).then((res) => res.insert_quizzes_one);
};

module.exports = {
  getQuizById,
  getPoapTokenUrlForQuiz,
  createQuiz,
};
