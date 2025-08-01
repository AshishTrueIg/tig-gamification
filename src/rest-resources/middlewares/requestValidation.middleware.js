import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import ajv from '@src/libs/ajv'

/**
 * A Socket Context Data type
 * @typedef {Object} RestRequestSchemas
 * @property {import('ajv').Schema} querySchema
 * @property {import('ajv').Schema} paramsSchema
 * @property {import('ajv').Schema} bodySchema
 */

/**
 *
 * @memberof Rest Middleware
 * @export
 * @name requestValidationMiddleware
 * @param {RestRequestSchemas} schema
 * @return {function}
 * It will return a express style middleware function with closure of query, params, and body json schema
 * If there is any error while validating the schemas it will log error and return RequestInputValidationError
 *
 * @example
 * // you can define request schemas
 * // for body, query and params
 * requestValidationMiddleware({
 *   querySchema: {
 *     type: 'string'
 *   },
 *   paramsSchema: {
 *     type: 'string'
 *   },
 *   bodySchema: {
 *     type: 'string'
 *   }
 * })
 */
export function requestValidationMiddleware ({ query = {}, params = {}, body = {} }) {
  const compiledQuerySchema = ajv.compile(query)
  const compiledParamsSchema = ajv.compile(params)
  const compiledBodySchema = ajv.compile(body)

  return (req, _, next) => {
    const errorPayload = {}

    if (compiledQuerySchema) {
      if (!compiledQuerySchema(req.query)) errorPayload.query = ajv.errorsText(compiledQuerySchema.errors, { separator: ' ||||| ' }).split(' ||||| ')
    }

    if (compiledParamsSchema) {
      if (!compiledParamsSchema(req.params)) errorPayload.params = ajv.errorsText(compiledParamsSchema.errors, { separator: ' ||||| ' }).split(' ||||| ')
    }

    if (compiledBodySchema) {
      if (!compiledBodySchema(req.body)) errorPayload.body = ajv.errorsText(compiledBodySchema.errors, { separator: ' ||||| ' }).split(' ||||| ')
    }

    (errorPayload.query || errorPayload.body || errorPayload.params) ? next(new RequestInputValidationError(errorPayload)) : next()
  }
}
