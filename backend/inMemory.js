const memoryStore = {
  remove: function(key) {
    if (this[key]) {
      clearTimeout(this[key].removeTimeoutId)
      delete this[key]
      return true
    } else return false
  },
  add: function(key, value) {
    if (this[key]) this.remove(key)

    const selfDestruct = () => {
      this.remove(key)
    }
    const twentyfourHours = 24 * 3600 * 1000

    this[key] = {
      value,
      removeTimeoutId: setTimeout(selfDestruct, twentyfourHours)
    }
  },
  get: function(key) {
    return this[key] && this[key].value
  }
}

async function createStorage({ id, pickup, username }) {
  const storage = {id, pickup, username}
  memoryStore.add(username, storage)
  console.log('creating storage ', storage)
  return storage
}

async function getStorage(username) {
  const storage = memoryStore.get(username)
  console.log('got storage ', storage)
  return storage
}

async function deleteStorage(username) {
  const success = memoryStore.remove(username)
  console.log('deleted ', success)
  return success
}

module.exports = {
  createStorage,
  getStorage,
  deleteStorage,
}