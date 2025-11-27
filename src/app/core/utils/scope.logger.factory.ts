import { inject } from '@angular/core';
import { LoggerManager } from '@core/service/logger/logger-manager';

import { ScopedLogger } from './scope.logger';

/**
 * Factory function to create a `ScopedLogger` instance with a component-specific scope.
 *
 * This utility function automatically determines the name of the calling component/class
 * and uses it to scope log messages. If the name cannot be resolved, `"UnknownComponent"` is used.
 *
 * @param component - The class or function to associate the logger with. Typically `this.constructor`.
 * @returns A new `ScopedLogger` instance with contextual logging.
 */
export function scopedLoggerFactory(component: unknown): ScopedLogger {
  const loggerService = inject(LoggerManager);
  const scope =
    typeof component === 'function' && 'name' in component ? component.name : 'UnknownComponent';

  return new ScopedLogger(loggerService, scope);
}

export { ScopedLogger };
