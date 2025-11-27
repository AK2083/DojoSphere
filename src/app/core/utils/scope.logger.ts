import { LoggerManager } from '@core/service/logger/logger-manager';

/**
 * A wrapper around `LoggerService` that adds a fixed "scope" (typically a component or class name)
 * to all log messages. This improves traceability and log clarity during development and debugging.
 */
export class ScopedLogger {
  /**
   * Creates a new scoped logger.
   *
   * @param logger - The base logger service to delegate to.
   * @param scope - A string identifying the source (e.g., component/class name).
   */
  constructor(
    private readonly logger: LoggerManager,
    private readonly scope: string,
  ) {}

  /**
   * Logs a debug-level message with the current scope.
   *
   * @param message - The log message to display.
   * @param params - Optional contextual parameters (e.g., objects or values).
   */
  log(message: string, params?: unknown): void {
    this.logger.log({ scope: this.scope, message, params });
  }

  /**
   * Logs an error-level message with the current scope.
   *
   * @param message - The error message to display.
   * @param params - Optional contextual parameters (e.g., error objects).
   */
  error(message: string, params?: unknown): void {
    this.logger.error({ scope: this.scope, message, params });
  }

  /**
   * Logs a warning-level message with the current scope.
   *
   * @param message - The warning message to display.
   * @param params - Optional contextual parameters.
   */
  warn(message: string, params?: unknown): void {
    this.logger.warn({ scope: this.scope, message, params });
  }
}
