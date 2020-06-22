const gql = require('graphql-tag')

const schema = gql`
  type Query {
    storage(id: String!): Storage
  }
  type Mutation {
    createStorage(pickup: PointInput, dropoff: PointInput): Storage
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
