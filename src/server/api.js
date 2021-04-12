const axios = require('axios');

const miscRoutes = (app) => {
  app.get('/api/now', (req, res) => {
    res.json({ now: Date.now(), appName: 'IDIGO' });
  });

  app.post('/api/proxy', async (req, res) => {
    const { url, method, data } = req.body;
    if (method === 'GET') {
      const retRaw = await axios.get(url);
      res.json({retRaw:1});
    }
    else if (method === 'POST') {
      const retRaw = await axios.post(url, data);
      console.log(retRaw);
      res.json(retRaw.data);
    }
  });
};

module.exports = miscRoutes;
