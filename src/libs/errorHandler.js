import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import Logger from './logger'

/**
 * @class ErrorHandler
 * Handles errors during execution by logging them, rolling back database transactions (if applicable),
 * and ensuring consistent error handling across the application.
 */
export class ErrorHandler {
  /**
   * Handles errors encountered during execution.
   * Logs the error, attempts transaction rollback (if applicable), and throws a standardized error.
   *
   * @param {Error} error - The error instance caught during execution.
   * @param {Object} instance - The class instance where the error occurred.
   * @param {Object} [instance.dbTransaction] - The database transaction instance (if applicable).
   * @throws {AppError} - Throws a standardized `AppError` with additional context.
   */
  static async handle (error, instance) {
    const handlerName = instance.constructor.name.toUpperCase()

    // Log the error
    Logger.error(error, `------------------------ ${handlerName} - Execution failed ------------------------`)

    // Attempt transaction rollback if a database transaction exists
    if (instance.dbTransaction) {
      try {
        await instance.dbTransaction.rollback()
      } catch (rollbackError) {
        Logger.error({ rollbackError }, `------------------------ ${handlerName} - Transaction rollback failed ------------------------`)
      }
    }

    // Re-throw application errors directly
    if (error instanceof AppError) {
      throw error
    }

    // Wrap unknown errors in AppError and rethrow
    throw new AppError({
      ...Errors.INTERNAL_ERROR,
      message: error.message || error.description,
      stack: error.stack,
      handler: handlerName
    })
  }
}
