const { ApolloServer } = require('apollo-server-lambda')
const resolvers = require('./resolvers')
const schema = require('./schema')


const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  introspection: true,
  playground: true,
})

module.exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
  },
})
module.exports.hello = async e => {
  return { statusCode: 200, body: JSON.stringify({
    title: 'Hello endpoint',
    message: 'hello',
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
  })}
}
