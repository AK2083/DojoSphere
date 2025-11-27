import { Injectable } from '@angular/core';
import { Logger } from '@core/types/logger';
import { environment } from '@environments/environment';

/**
 * A centralized logging service that wraps browser console logging.
 * Logging output is controlled via environment settings.
 *
 * Logging levels:
 * - `debug`: includes all logs
 * - `warning`: includes warning and error logs
 * - `error`: includes only error logs
 * - In non-production mode, all levels are enabled by default
 *
 * @providedIn root - This service is globally available.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerManager {
  /**
   * Determines if debug logs should be shown.
   */
  debugFlag = environment.logLevel === 'debug' && !environment.production;

  /**
   * Determines if warnings should be shown.
   */
  warningFlag =
    environment.logLevel === 'warning' ||
    environment.logLevel === 'debug' ||
    !environment.production;

  /**
   * Determines if errors should be shown.
   */
  errorFlag =
    environment.logLevel === 'error' ||
    environment.logLevel === 'warning' ||
    environment.logLevel === 'debug' ||
    !environment.production;

  /**
   * Logs an error message to the console if error logging is enabled.
   *
   * @param model - An object containing the log scope, message, and optional parameters.
   */
  error(model: Logger): void {
    if (this.errorFlag) {
      console.error(model.scope, model.message, model.params !== undefined ? model.params : []);
    }
  }

  /**
   * Logs a warning message to the console if warning logging is enabled.
   *
   * @param model - An object containing the log scope, message, and optional parameters.
   */
  warn(model: Logger): void {
    if (this.warningFlag) {
      console.warn(model.scope, model.message, model.params !== undefined ? model.params : []);
    }
  }

  /**
   * Logs a debug message to the console if debug logging is enabled.
   *
   * @param model - An object containing the log scope, message, and optional parameters.
   */
  log(model: Logger): void {
    if (this.debugFlag) {
      console.log(model.scope, model.message, model.params !== undefined ? model.params : []);
    }
  }
}
