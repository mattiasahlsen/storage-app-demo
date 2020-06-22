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
  }

  type Point {
    x: Float!
    y: Float!
    time: Int
  }
  input PointInput {
    x: Float!
    y: Float!
    time: Int
  }

  type Storage {
    id: String!
    username: String!
    pickup: Point
  }
`

module.exports = schema
