const mongoist = require('mongoist');
const { envConfig } = require('./constants.js');

const db = mongoist(envConfig.dbUrl);
console.log(`MongoURL: ${envConfig.dbUrl}`);

db.on('error', (err) => {
  console.log('database error', err);
});
db.on('connect', () => {
  console.log(`Connected to database: ${envConfig.dbName}`);
});

exports.collectionGoods = envConfig.nodeEnv === 'production' ? db.collection_goods : db.collection_goods_dev;
exports.orders = envConfig.nodeEnv === 'production' ? db.orders : db.orders_dev;
exports.products = envConfig.nodeEnv === 'production' ? db.products : db.products_dev;