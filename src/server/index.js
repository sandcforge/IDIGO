const compression = require('compression');
const express = require('express');
const GreenlockExpress = require('greenlock-express');
const path = require('path');
const miscRoutes = require('./api.js');
const { envConfig } = require('./constants.js');
const { syncCollection } = require('./syncDb.js');

const app = express();
app.use(express.json());

miscRoutes(app);

const outputPath = path.resolve(process.cwd(), 'dist');
app.use(compression());
app.use('/', express.static(outputPath));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(outputPath, 'index.html'));
});

if (process.env.USE_SSL) {
  GreenlockExpress.init({
    packageRoot: process.cwd(),
    configDir: "./.glConfig",
    // contact for security and critical bug notices
    maintainerEmail: "sandcforge@gmail.com",
    // whether or not to run at cloudscale
    cluster: false,
  })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);
}
else {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}!`);
    console.log(`NodeEnv: ${envConfig.nodeEnv}`);
  });
}



