const envConfig = {
  nodeEnv: process.env.NODE_ENV,
  dbUrl: "mongodb+srv://touchberry:touchberry!@idigo.smsp4.mongodb.net/idigo?retryWrites=true&w=majority",
  dbName: 'idigo',
}

module.exports = {
  envConfig,
};