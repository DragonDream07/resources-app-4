'use strict';

const morgan = require('morgan');
const winston = require('winston');

/**
 * Winston logger instance used for HTTP request logging.
 * Writes combined logs to the console; in production environments the
 * transport can be replaced with a file or remote sink.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'development'
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : winston.format.json(),
    }),
  ],
});

/**
 * Morgan stream that forwards HTTP access log lines to Winston.
 */
const morganStream = {
  write(message) {
    logger.http(message.trimEnd());
  },
};

/**
 * Morgan format string.
 * Uses the 'combined' preset in production and 'dev' in other environments
 * for more human-readable output during development.
 */
const morganFormat =
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

/**
 * Express middleware that logs every HTTP request via Morgan → Winston.
 */
const requestLogger = morgan(morganFormat, { stream: morganStream });

module.exports = requestLogger;
module.exports.logger = logger;
