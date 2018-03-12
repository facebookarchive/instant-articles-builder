/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const AdsTypes = {
  NONE: 'NONE',
  AUDIENCE_NETWORK: 'AUDIENCE_NETWORK',
  RAW_HTML: 'RAW_HTML',
};

export type AdsType = $Values<typeof AdsTypes>;

export default AdsTypes;
