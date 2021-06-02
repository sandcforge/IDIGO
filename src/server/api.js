const axios = require('axios');
const { collectionGoods } = require('./db.js');

const miscRoutes = (app) => {
  app.get('/api/now', (req, res) => {
    res.json({ now: Date.now(), appName: 'IDIGO' });
  });

  app.get('/api/getcollections', async (req, res) => {
    try {
      const o = await collectionGoods.find({});
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
