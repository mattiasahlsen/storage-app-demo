const database = require('./inMemory')

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
    async storage(parent, { username }) {
      const storage = await database.getStorage(username)
      return storage
    }
  },
  Mutation: {
    async createStorage(parent, { pickup, username }) {
      const id = randomId()
      const storage = { id, pickup, username }
      const myStorage = await database.createStorage(storage)
      return myStorage
    },
    async deleteStorage(parent, { username }) {
      const success = await database.deleteStorage(username)
      return success
    }
  }
}

module.exports = resolvers
