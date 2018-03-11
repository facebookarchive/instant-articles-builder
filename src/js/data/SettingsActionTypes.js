/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const SettingsActionTypes = {
  EDIT_ADS_RAW_HTML: 'EDIT_ADS_RAW_HTML',
  EDIT_ANALYTICS_RAW_HTML: 'EDIT_ANALYTICS_RAW_HTML',
  EDIT_AUDIENCE_NETWORK_PLACEMENT_ID: 'EDIT_AUDIENCE_NETWORK_PLACEMENT_ID',
  EDIT_FB_PIXEL_ID: 'EDIT_FB_PIXEL_ID',
  EDIT_STYLE_NAME: 'EDIT_STYLE_NAME',
};

export type SettingsActionType = $Values<typeof SettingsActionTypes>;

export default SettingsActionTypes;
