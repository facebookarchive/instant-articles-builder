/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Get a mock of the fs module
const fs = jest.genMockFromModule('fs');

// Variable to store a callback for the writeFile function
let writeFileCallback = null;
// Special function for our tests to set a writeFile callback
fs.__setWriteFileCallback = callback => (writeFileCallback = callback);

// Override the writeFile function with one that calls our callback
fs.writeFile = (fileName, contents, errorCallback) => {
  if (writeFileCallback) {
    writeFileCallback(fileName, contents, errorCallback);
  }
};

module.exports = fs;
