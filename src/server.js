'use strict';

const createApp = require('./app');
const config = require('./config/index');
const logger = require('./utils/logger');

const app = createApp();
const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
