const express = require("express");
const bodyParser = require("body-parser");
const fetch = import("node-fetch");

const { GraphQLClient, gql } = require("graphql-request");
const client = new GraphQLClient("http://localhost:8080/v1/graphql");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Request Handler
app.post("/GetPoapClaimUrl", async (req, res) => {
  const { quizId } = req.body.input;

  const query = gql`
    query GetPoapUrlForQuiz($quizId: Int!) {
      poap_urls(
        limit: 1
        where: {
          _not: { used: { _eq: true } }
          _and: { quiz_id: { _eq: $quizId } }
        }
      ) {
        url
        used
        id
      }
    }
  `;

  const poapUrlResult = await client
    .request(query, { quizId })
    .then((res) => res.poap_urls[0]);

  const markUsedQuery = gql`
    mutation ($urlId: Int!) {
      update_poap_urls_by_pk(pk_columns: { id: $urlId }, _set: { used: true }) {
        used
        id
        url
      }
    }
  `;

  if (!poapUrlResult) {
    return res.status(400).json({
      message: "all tokens claimed",
    });
  }

  const usedResult = await client
    .request(markUsedQuery, {
      urlId: poapUrlResult.id,
    })
    .then((res) => res.update_poap_urls_by_pk);

  return res.json({
    poapClaimUrl: usedResult.url,
  });
});

app.listen(PORT);
