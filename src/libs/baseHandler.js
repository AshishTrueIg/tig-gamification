import dayjs from 'dayjs'
import { ErrorHandler } from './errorHandler'
import Logger from './logger'

/**
 * @class BaseHandler
 * @description
 * A generic base class for handling execution workflows with centralized logging and error management.
 * It provides a structured way to execute tasks while ensuring consistent logging,
 * error handling, and optional database transaction support.
 *
 * @property {Object} args - Input parameters for the handler.
 * @property {Object} context - Contextual data (e.g., user session, database transaction).
 * @property {Object} dbTransaction - Database transaction instance, if available.
 */
export class BaseHandler {
  /**
   * @constructor
   * @param {Object} [args={}] - Input parameters for the handler.
   * @param {Object} [context={}] - Context data including database transactions, user session, etc.
   */
  constructor (args = {}, context = {}) {
    this.args = args
    this.context = context
    this.dbTransaction = context.sequelizeTransaction // Attach DB transaction if provided
  }

  /**
   * @static
   * @async
   * @method execute
   * @description
   * Instantiates the handler and runs the `run()` method, ensuring structured logging and error handling.
   * @param {Object} [args={}] - Input parameters.
   * @param {Object} [context={}] - Contextual data such as database transactions.
   * @returns {Promise<*>} - Returns the result of the `run()` method.
   * @throws {Error} - Catches and processes errors using `handleError`.
   */
  static async execute (args = {}, context = {}) {
    const startTime = dayjs()
    const handlerName = this.name.toUpperCase()
    const instance = new this(args, context)

    try {
      Logger.info({ args }, `------------------------ ${handlerName} - Execution started -----------------------------`)

      const result = await instance.run()

      const duration = dayjs().diff(startTime)
      Logger.info(`------------------------ ${handlerName} - Execution completed in ${duration} ms -----------------------------`)

      return result
    } catch (error) {
      await instance.handleError(error)
    }
  }

  /**
   * @async
   * @method run
   * @description
   * This method must be implemented by subclasses to define the core logic of the handler.
   * @throws {Error} - Throws an error if not implemented in the subclass.
   */
  async run () {
    throw new Error('The run() method must be implemented in subclass')
  }

  /**
   * @async
   * @method handleError
   * @description
   * Handles errors using the centralized `ErrorHandler` class.
   * @param {Error} error - The error instance thrown during execution.
   */
  async handleError (error) {
    await ErrorHandler.handle(error, this)
  }
}
