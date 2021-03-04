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

class Webserver {
  constructor() {
    this.usingLocalWebserver = DEFAULT_START_LOCAL_WEBSERVER;
    if (process.env.START_LOCAL_PREVIEW_WEBSERVER !== undefined) {
      this.usingLocalWebserver =
        process.env.START_LOCAL_PREVIEW_WEBSERVER === 'true';
    }

    this.host = process.env.PREVIEW_WEBSERVER_HOST || DEFAULT_HOST;
    this.port = process.env.PREVIEW_WEBSERVER_PORT || DEFAULT_PORT;

    this.baseUrl = new URL(this.host);
    this.baseUrl.port = this.port;
  }

  init() {
    if (!this.usingLocalWebserver) {
      return;
    }

    this.phpServer = new php();

    if (process.platform === 'win32') {
      this.phpServer.server({
        port: this.port,
        base: path.resolve(__dirname) + '/../../webserver',
        bin: path.resolve(__dirname) + '/../../bin/php/php.exe',
      });
    } else {
      this.phpServer.server({
        port: this.port,
        base: path.resolve(__dirname) + '/../../webserver',
      });
    }
  }

  stop() {
    if (!this.usingLocalWebserver) {
      return;
    }

    this.phpServer.closeServer();
  }
}

module.exports = new Webserver();
