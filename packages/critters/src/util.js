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

export function isSubpath(basePath, currentPath) {
  return !path.relative(basePath, currentPath).startsWith('..');
}
