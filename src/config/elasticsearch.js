'use strict';

const config = require('./index');

/**
 * Elasticsearch client configuration derived from the central config.
 * Auth object is only included when credentials are provided.
 */
const elasticsearchConfig = {
  node: config.elasticsearch.node,
  ...(config.elasticsearch.username && config.elasticsearch.password
    ? {
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      }
    : {}),
};

module.exports = elasticsearchConfig;
