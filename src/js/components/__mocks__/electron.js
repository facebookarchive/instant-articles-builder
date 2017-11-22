/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// The file name that will always be returned as the one selected by the user
const FILE_NAME = 'rules.json';

// Get a mock of the Electron module
const electron = {
  remote: {
    // Replace the function we will use in the dialog object
    dialog: {
      // Call directly the callback function passing a valid file name
      showSaveDialog: (options, callback) => callback(FILE_NAME),
    },
  },
};

module.exports = electron;
