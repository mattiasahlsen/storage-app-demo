// add to handler.js
const dynamodb = require('serverless-dynamodb-client')

let docClient;

if (process.env.NODE_ENV === 'production') {
  const AWSXRay = require('aws-xray-sdk'); // eslint-disable-line global-require
  const AWS = AWSXRay.captureAWS(require('aws-sdk')); // eslint-disable-line global-require
  docClient = new AWS.DynamoDB.DocumentClient();
} else {
  console.log('in dev mode')
  docClient = dynamodb.doc;
}

const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

async function createStorage({ id, pickup, username }) {
  const storage = {id, pickup, username}
  console.log('creating storage in database', storage)
  const data = await promisify(callback => {
    docClient.put({
      TableName: 'Storage',
      Item: storage,
    }, callback)
  })
  return storage
}

async function getStorage(username) {
  const data = await promisify(callback => {
    docClient.get({
      TableName: 'Storage',
      Key: {
        username,
      }
    }, callback)
  })
  return data.Item
}

async function deleteStorage(username) {
  const data = await promisify(callback => {
    docClient.delete({
      TableName: 'Storage',
      Key: {
        username,
      }
    }, callback)
  })
  console.log('deleted item, ', data)
  return true
}

module.exports = {
  createStorage,
  getStorage,
  deleteStorage,
}
