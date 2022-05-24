/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const path = require('path');
const php = require('gulp-connect-php');

const DEFAULT_HOST = 'http://localhost';
const DEFAULT_PORT = 8105;
const DEFAULT_START_LOCAL_WEBSERVER = true;

class PreviewWebserver {
  constructor() {
    this.usingLocalWebserver = DEFAULT_START_LOCAL_WEBSERVER;
    if (process.env.IA_BUILDER_START_LOCAL_PREVIEW_WEBSERVER !== undefined) {
      this.usingLocalWebserver =
        process.env.IA_BUILDER_START_LOCAL_PREVIEW_WEBSERVER === 'true';
    }

    this.host = process.env.IA_BUILDER_PREVIEW_WEBSERVER_HOST || DEFAULT_HOST;
    this.port = process.env.IA_BUILDER_PREVIEW_WEBSERVER_PORT || DEFAULT_PORT;

    this.baseUrl = new URL(this.host);
    this.baseUrl.port = this.port;
  }

  init() {
    console.info(
      `Using ${this.usingLocalWebserver ? 'local' : 'remote'} webserver ` +
        `at ${this.host}:${this.port}`
    );

    if (!this.usingLocalWebserver) {
      return;
    }

    this.phpServer = new php();

    console.debug('Starting local webserver...');
    if (process.platform === 'win32') {
      this.phpServer.server({
        port: this.port,
        base: path.resolve(__dirname) + '/../../../webserver',
        bin: path.resolve(__dirname) + '/../../../bin/php/win32/php.exe',
      });
    } else if (process.platform === 'darwin'){
      this.phpServer.server({
        port: this.port,
        base: path.resolve(__dirname) + '/../../../webserver',
        bin: path.resolve(__dirname) + '/../../../bin/php/darwin/bin/php',
      });
    }
    else
    {
      this.phpServer.server({
        port: this.port,
        base: path.resolve(__dirname) + '/../../../webserver',
      });
    }
    console.info('Local webserver started.');
  }

  stop() {
    if (!this.usingLocalWebserver) {
      return;
    }

    console.debug('Closing local webserver...');
    this.phpServer.closeServer();
    console.info('Local webserver closed.');
  }
}

module.exports = new PreviewWebserver();
