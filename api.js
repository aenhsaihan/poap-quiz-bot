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

module.exports = {
  getQuizById,
  getPoapTokenUrlForQuiz,
};
