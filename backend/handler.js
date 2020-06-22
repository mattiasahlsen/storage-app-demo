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
  console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT)
  return { statusCode: 200, body: JSON.stringify({ message: 'hello' })}
}
