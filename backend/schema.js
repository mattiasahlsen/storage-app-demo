const gql = require('graphql-tag')

const schema = gql`
  type Query {
    storage(username: String!): Storage
  }
  type Mutation {
    createStorage(
      pickup: PointInput!,
      username: String!
    ): Storage
    deleteStorage(username: String!): Boolean
  }

  type Point {
    longitude: Float!
    latitude: Float!
    time: Float!
  }
  input PointInput {
    longitude: Float!
    latitude: Float!
    time: Float!
  }

  type Storage {
    id: String!
    username: String!
    pickup: Point
  }
`

module.exports = schema
