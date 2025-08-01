import { Errors } from '@src/errors/errorCodes'
import { dayjs, serverDayjs } from '@src/libs/dayjs'
import Ajv from 'ajv'
import isoWeek from 'dayjs/plugin/isoWeek'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { PST_TIMEZONE } from './constants/public.constants'

const ajv = new Ajv({ coerceTypes: true, removeAdditional: true }) // Auto-coerce types & remove unknown fields
dayjs.extend(isoWeek)

/**
 * Utility class for API-related helper functions.
 */
export class ApiHelper {
  /**
   * Calculates pagination details based on page number and limit.
   * Ensures pageNo is at least 1 and limit is positive.
   *
   * @param {number} [pageNo=1] - Page number (default: 1).
   * @param {number} [limit=10] - Items per page (default: 10).
   * @returns {{ offset: number, limit: number, pageNo: number }} Pagination object.
   *
   * @example
   * const pagination = ApiHelper.getPagination(2, 20);
   * console.log(pagination); // { offset: 20, limit: 20, pageNo: 2 }
   */
  static getPagination (pageNo = 1, limit = 10, pagination = true) {
    if (!pagination) return { offset: null, limit: null, pageNo: 1, pagination }

    pageNo = Math.max(1, Number(pageNo) || 1) // Ensure pageNo is at least 1
    limit = Math.max(1, Number(limit) || 10) // Ensure limit is positive

    return { offset: (pageNo - 1) * limit, limit, pageNo, pagination }
  }

  /**
   * Generates a sanitized date range based on input or defaults.
   * If no start date is provided, it defaults to the start of the current week.
   * If no end date is provided, it defaults to tomorrow's end.
   *
   * @param {string} [startDate] - Optional start date.
   * @param {string} [endDate] - Optional end date.
   * @returns {{ startDate: string, endDate: string }} Sanitized date range object.
   *
   * @example
   * const dateRange = ApiHelper.getDateRange('2024-03-01', '2024-03-05');
   * console.log(dateRange); // { startDate: '2024-03-01T00:00:00.000Z', endDate: '2024-03-05T23:59:59.999Z' }
   */
  static getDateRange (startDate, endDate) {
    const start = startDate
      ? dayjs.tz(startDate, PST_TIMEZONE).startOf('day')
      : dayjs().tz(PST_TIMEZONE).startOf('day') // changed from startOf('isoWeek')

    const end = endDate
      ? dayjs.tz(endDate, PST_TIMEZONE).endOf('day')
      : dayjs().tz(PST_TIMEZONE).endOf('day')

    return {
      startDate: start.toISOString(), // Use these in DB query
      endDate: end.toISOString()
    }
  }

  /**
   * Validates and sanitizes query parameters using an Ajv schema.
   * This ensures the incoming query parameters adhere to the expected format.
   *
   * @param {Object} queryParams - The query parameters object.
   * @param {Object} schema - The JSON schema for validation.
   * @returns {Object} - Validated and sanitized query parameters.
   * @throws {Error} - Throws an error if validation fails.
   *
   * @example
   * const schema = {
   *   type: 'object',
   *   properties: {
   *     page: { type: 'integer', minimum: 1 },
   *     limit: { type: 'integer', minimum: 1, maximum: 100 }
   *   },
   *   required: ['page'],
   *   additionalProperties: false
   * };
   *
   * try {
   *   const sanitizedQuery = ApiHelper.sanitizeQuery({ page: "2", limit: "20" }, schema);
   *   console.log(sanitizedQuery); // { page: 2, limit: 20 }
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  static sanitizeQuery (queryParams, schema) {
    const validate = ajv.compile(schema) // Compile schema on the fly
    const sanitizedParams = { ...queryParams }

    if (!validate(sanitizedParams)) {
      throw new Error(`Invalid query parameters: ${ajv.errorsText(validate.errors)}`)
    }

    return sanitizedParams
  }

  /**
   * Sends a structured API response.
   * Ensures all successful responses follow a consistent format.
   *
   * @param {Object} context - The Express request, response, and next function.
   * @param {Object} context.req - The request object.
   * @param {Object} context.res - The response object.
   * @param {Function} context.next - The Express next function.
   * @param {Object} data - The response payload.
   *
   * @example
   * ApiHelper.sendResponse({ req, res, next }, { user: 'John Doe' });
   * // Response: { data: { user: 'John Doe' }, errors: [] }
   */
  static sendResponse ({ req, res, next }, data) {
    if (data && !_.isEmpty(data)) {
      res.payload = { data, errors: [] }
      const statusCode = res.statusCode || req?.context?.statusCode || StatusCodes.OK
      res.status(statusCode).json({ ...res.payload })
    } else {
      next(Errors.INTERNAL_ERROR)
    }
  }
}
