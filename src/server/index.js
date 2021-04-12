const express = require('express');
const miscRoutes = require('./api.js');

const app = express();
app.use(express.static('dist'));
app.use(express.json());

miscRoutes(app);
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
