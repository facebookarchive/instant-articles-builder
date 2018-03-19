/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// The file name that will always be returned as the one selected by the user
const FILE_NAME = 'rules.json';

// Variable to store the value returned by the getVersion function
let version = '0.0.0';

// Get a mock of the Electron module
const electron = {
  remote: {
    // Replace the function we will use in the app object
    app: {
      // We will return the value of the 'version' variable
      getVersion: () => version,
      // Mechanism to update the value of the 'version' variable
      __setVersion: value => version = value,
    },
    // Replace the function we will use in the dialog object
    dialog: {
      // Call directly the callback function passing a single valid file name
      showOpenDialog: (options, callback) => callback([FILE_NAME]),
      // Call directly the callback function passing a valid file name
      showSaveDialog: (options, callback) => callback(FILE_NAME),
    },
  },
};

module.exports = electron;
