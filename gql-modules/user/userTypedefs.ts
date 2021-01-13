import { gql } from 'apollo-server-fastify';

export default gql`
  type Name {
    first: String!
    last: String!
  }
  type User {
    email: String
    userId: String
    name: Name!
  }
  type Query {
    me: User!
  }
`;
