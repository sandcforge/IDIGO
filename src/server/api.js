const axios = require('axios');

const miscRoutes = (app) => {
  app.get('/api/now', (req, res) => {
    res.json({ now: Date.now(), appName: 'IDIGO' });
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
