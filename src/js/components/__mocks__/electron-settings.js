/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const settings = {
  get: property => {
    switch (property) {
      case 'nux.skip':
        return true;
    }
    return null;
  },
  set: () => {},
};

module.exports = settings;
