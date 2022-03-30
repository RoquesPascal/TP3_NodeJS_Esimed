require('dotenv').config();
const WebServer = require('../../src/core/web-server');

module.exports = async () => {
  const webServer = new WebServer();
  webServer.start();
  global.webServer = webServer;
}
