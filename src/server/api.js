const axios = require('axios');
const { collectionGoods, orders, products } = require('./db.js');

const miscRoutes = (app) => {
  app.get('/api/now', (req, res) => {
    res.json({ now: Date.now(), appName: 'IDIGO' });
  });

  app.post('/api/getcollections', async (req, res) => {
    const { pageSize, pageIndex } = req.body;
    try {
      const o = await collectionGoods.aggregate([{
        "$limit": pageSize
      }, {
        "$skip": pageIndex * pageSize
      }, {
        "$lookup": {
          "localField": "GodCode",
          "from": "products_dev",
          "foreignField": "GodCode",
          "as": "_"
        }
      }, {
        "$unwind": {
          path: "$_",
          preserveNullAndEmptyArrays: true
        }
      }]);

      res.json(o);
    }
    catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  app.post('/api/delgoods', async (req, res) => {
    const { data } = req.body;
    try {
      const results = await collectionGoods.remove(
        { GodId: data.GodId },
      );
      res.sendStatus(200);
    }
    catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  app.post('/api/addgoods', async (req, res) => {
    const { data } = req.body;
    try {
      const results = await collectionGoods.update(
        { GodId: data.GodId },
        { $set: data },
        { upsert: true },
      );
      res.sendStatus(200);
    }
    catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  app.post('/api/addorder', async (req, res) => {
    const { data } = req.body;
    try {
      const results = await orders.update(
        { OrdId: data.OrdId },
        { $set: data },
        { upsert: true },
      );
      res.sendStatus(200);
    }
    catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  app.post('/api/getorders', async (req, res) => {
    const { pageSize, pageIndex } = req.body;
    try {
      const o = await orders.find({}, { _id: 1,
        _revenue: 1,
        _customerService: 1,
        OrdCode: 1,
        OrdId: 1,
      });
      res.json(o);
    }
    catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  app.post('/api/proxy', async (req, res) => {
    const { url, method, data } = req.body;
    if (method === 'GET') {
      console.log('proxy GET');
      const retRaw = await axios.get(encodeURI(url));
      res.json(retRaw.data);
    }
    else if (method === 'POST') {
      console.log('proxy POST');
      const retRaw = await axios.post(encodeURI(url), data);
      res.json(retRaw.data);
    }
  });
};

module.exports = miscRoutes;
