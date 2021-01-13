import { gql } from 'apollo-server-fastify'

export default gql`
    type Mutation {
        register(email: String!, password: String!): User
        login(email: String!, password: String!): User
    }
`