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
      console.log('callback called')
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

async function createStorage({ id, pickup, username }) {
  const storage = {id, pickup, username}
  const data = await promisify(callback => {
    docClient.put({
      TableName: 'Storage',
      Item: storage,
    }, callback)
  })
  return storage
}

async function getStorage(id) {
  const data = await promisify(callback => {
    docClient.get({
      TableName: 'Storage',
      Key: {
        id,
      }
    }, callback)
  })
  return data.Item
}

module.exports = {
  createStorage,
  getStorage,
}
