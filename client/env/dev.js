const prodEnv = require('./prod')

module.exports = Object.assign(prodEnv, {
  NODE_ENV: 'development',
  HOST: 'http://localhost:5000',
  WS_HOST: 'ws://localhost:9000',
})
