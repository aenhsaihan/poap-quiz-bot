import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:8080/v1/graphql');

const requestQuiz = (quizId) => {
    const query = gql`
    
    `;
}