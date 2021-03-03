/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const path = require('path');
const php = require('gulp-connect-php');
const phpServer = new php();

const DEFAULT_WEBSERVER_PORT = 8105;

class Webserver {
  init() {
    console.debug('Initializing local webserver...');
    if (process.platform === 'win32') {
      phpServer.server({
        port: DEFAULT_WEBSERVER_PORT,
        base: path.resolve(__dirname) + '/../../webserver',
        bin: path.resolve(__dirname) + '/../../bin/php/php.exe',
      });
    } else {
      phpServer.server({
        port: DEFAULT_WEBSERVER_PORT,
        base: path.resolve(__dirname) + '/../../webserver',
      });
    }
  }

  stop() {
    console.debug('Closing local webserver...');
    phpServer.closeServer();
  }
}

module.exports = new Webserver();
