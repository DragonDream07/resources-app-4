'use strict';

/**
 * Generic validation middleware factory for Joi schemas.
 *
 * @param {import('joi').ObjectSchema} schema - A Joi schema to validate against.
 * @param {'body'|'query'|'params'} [source='body'] - The part of the request
 *   object to validate.
 * @returns {Function} Express middleware that validates the specified source
 *   and either calls next() on success or returns a 422 JSON error response.
 */
function validate(schema, source = 'body') {
  return function (req, res, next) {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'The provided data failed validation.',
        errors,
      });
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
