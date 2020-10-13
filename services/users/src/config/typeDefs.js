import { gql } from 'apollo-server';

const typeDefs = gql`
  extend type Car @key(fields: "id") {
    id: ID! @external
  }

  type User {
    id: ID!
    username: String!
    cars: [Car]!
  }

  extend type Query {
    allUsers: [User]!
  }

  extend type Mutation {
    createUser(username: String!): User
  }
`;

export default typeDefs;
