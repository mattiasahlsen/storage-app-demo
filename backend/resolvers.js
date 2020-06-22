const database = require('./database')

const randomId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

const resolvers = {
  Query: {
    async storage(parent, { id }) {
      const storage = await database.getStorage(id)
      return storage
    }
  },
  Mutation: {
    async createStorage (parent, { pickup, username }) {
      const id = randomId()
      const storage = { id, pickup, username }
      const s = await database.createStorage(storage)
      return s
    }
  }
}

module.exports = resolvers
