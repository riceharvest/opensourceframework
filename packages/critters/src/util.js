/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import chalk from 'chalk';
import path from 'path';
import { realpathSync, existsSync } from 'fs';

const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];

export const defaultLogger = {
  trace(msg) {
    globalThis.console.trace(msg);
  },

  debug(msg) {
    globalThis.console.debug(msg);
  },

  warn(msg) {
    globalThis.console.warn(chalk.yellow(msg));
  },

  error(msg) {
    globalThis.console.error(chalk.bold.red(msg));
  },

  info(msg) {
    globalThis.console.info(chalk.bold.blue(msg));
  },

  silent() {}
};

export function createLogger(logLevel) {
  const logLevelIdx = LOG_LEVELS.indexOf(logLevel);

  return LOG_LEVELS.reduce((logger, type, index) => {
    if (index >= logLevelIdx) {
      logger[type] = defaultLogger[type];
    } else {
      logger[type] = defaultLogger.silent;
    }
    return logger;
  }, {});
}

/**
 * Checks if currentPath is a subpath of basePath.
 * Uses realpath to resolve symlinks when paths exist, preventing path traversal attacks.
 * Falls back to simple path comparison for non-existent paths (e.g., in tests).
 * 
 * @param {string} basePath - The base directory path
 * @param {string} currentPath - The path to check
 * @returns {boolean} true if currentPath is within basePath, false otherwise
 */
export function isSubpath(basePath, currentPath) {
  try {
    // Resolve both paths to absolute paths
    const resolvedBase = path.resolve(basePath);
    const resolvedCurrent = path.resolve(currentPath);
    
    // Check if paths exist - if so, resolve symlinks for extra security
    if (existsSync(resolvedBase) && existsSync(resolvedCurrent)) {
      // Resolve symlinks to their real paths to prevent symlink-based traversal
      const realBase = realpathSync(resolvedBase);
      const realCurrent = realpathSync(resolvedCurrent);
      
      // Check if realCurrent is within realBase
      const relative = path.relative(realBase, realCurrent);
      return !relative.startsWith('..') && !path.isAbsolute(relative);
    }
    
    // For non-existent paths (e.g., test mocks), use simple path comparison
    // This still prevents basic path traversal with ../
    const relative = path.relative(resolvedBase, resolvedCurrent);
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  } catch {
    // If any operation fails (permission denied, broken symlink, etc.), deny access
    return false;
  }
}
