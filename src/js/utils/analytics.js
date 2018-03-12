/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const { app } = require('electron').remote;

// Sending custom parameter to track the version of the app.
// By default, the PageView event shows 'Unknown' as of March 11, 2018
// eslint-disable-next-line no-undef
fbq('trackCustom', 'AppInit', {
  // Using Electron's getVersion to account for dev and packaged versions
  version: app ? app.getVersion() : 'Unknown',
});
