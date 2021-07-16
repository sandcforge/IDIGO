/**
 * usage: NODE_ENV=production node ./misc/manageCollections.js 
 */

const axios = require('axios');
const { collectionGoods } = require('../src/server/db.js');
const productIds = [
  40118,
  40165,
  39293,
  38577,
  38417,
  36923,
  36579,
  36380,
  33835,
  33729,
  31060,
  26607,
  26364,
  25704,
  23973,
  23223,
  23012,
  22608,
  19028,
  16926,
  15121,
  14922,
  14004,
  12958,
  12950,
  12310,
  11783,
  11122,
  10889,
  10821,
  10722,
  10672,
  10643,
  10614,
  10612,
  10610,
  10609,
  10317,
  10270,
  10269,
  10267,
  9776,
  9408,
  8424,
  8238,
  7514,
  7512,
  7422,
  5321,
  4381,
  4370,
  3787,
  3786,
  3775,
  3766,
  3754,
  3435,
  3423,
  3414,
  3335,
  3334,
  3333,
  3332,
  1598,
  1583,
  1563,
  1558,
  1531,
  1344,
  1343,
  1342,
  1286,
  1234,
  1233,
  1232,
  1204,
  1196,
  1195,
  1183,
  1182,
  1181,
  1147,
  1080,
  1068,
  1076,
  1060,
  928,
  38248,
  23912,
  1069,
  38367,
  1054,
  1051,
  952,
  987,
  1031,
  1046,
  40164,
];

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getProductDetailsById = async (id) => {
  const url = `https://www.snailsmall.com/Goods/GetById?data={"GodId":${id}}`;
  const retRaw = await axios.get(encodeURI(url));
  if (retRaw.data.ResCode === '01' && retRaw.data.Data !== null) {
    const newDetails = retRaw.data.Data;
    newDetails._updateAt = Date.now();
    const results = await collectionGoods.update(
      { GodId: newDetails.GodId },
      { $set: newDetails },
      { upsert: true },
    );
    console.log(`${id} is updated.`);
  }
}

(async () => {
  for (let i=0; i<productIds.length;i++) {
    await getProductDetailsById(productIds[i]);
    await sleep(200);
  }
})();

