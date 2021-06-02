const mongoist = require('mongoist');
const {envConfig} = require('./constants.js');

const db = mongoist(envConfig.dbUrl);
console.log(`MongoURL: ${envConfig.dbUrl}`);

db.on('error', (err) => {
  console.log('database error', err);
});
db.on('connect', () => {
  console.log(`Connected to database: ${envConfig.dbName}`);
});
exports.collectionGoods = db.collection_goods;