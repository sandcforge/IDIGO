const { default: axios } = require('axios');
const schedule = require('node-schedule');
const { ProvidePlugin } = require('webpack');
const { envConfig } = require('./constants');
const { collectionGoods } = require('./db');

// Sync every day on prod, and every min for dev
const rule = envConfig.nodeEnv === 'production' ? '0 0 0 * * *' : '0 * * * * *';
const syncCollection = schedule.scheduleJob(rule, async () => {
  console.log('Start to sync DB at ' + new Date().toISOString());
  const syncDb = async (item) => {
    try {
      const url = `https://www.snailsmall.com/Goods/GetById?data={"GodId":${item.GodId}}`;
      const retRaw = await axios.get(encodeURI(url));
      if (retRaw.data.ResCode === '01' && retRaw.data.Data !== null) {
        const newDetails = retRaw.data.Data;
        newDetails._updateAt = Date.now();
        const results = await collectionGoods.update(
          { GodId: newDetails.GodId },
          { $set: newDetails },
          { upsert: true },
        );
        console.log(`${item.GodId} is updated.`);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const startUpdateDBwithDelay = (idx) => {
    setTimeout(async () => {
      await syncDb(collections[idx]);
      idx += 1;
      if (idx < collections.length) {
        startUpdateDBwithDelay(idx);   //  decrement i and call myLoop again if i > 0
      };
    }, 1000);
  };

  const collections = await collectionGoods.find({});
  startUpdateDBwithDelay(0);
});

exports.syncCollection = syncCollection;
