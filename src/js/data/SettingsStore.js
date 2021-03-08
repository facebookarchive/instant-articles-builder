/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { ReduceStore } from 'flux/utils';
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import type { TransformationSettings } from '../models/TransformationSettings';
import { TransformationSettingsFactory } from '../models/TransformationSettings';

import type { SettingsActionType } from './SettingsActionTypes';
import SettingsActionTypes from './SettingsActionTypes';

type Action = {
  adsRawHtml?: string,
  adsType?: string,
  analyticsRawHtml?: string,
  audienceNetworkPlacementId?: string,
  fbPixelId?: string,
  styleName?: string,
  type: SettingsActionType,
};

class SettingsStore extends ReduceStore<TransformationSettings> {
  constructor() {
    super(RulesEditorDispatcher);
  }

  getInitialState(): TransformationSettings {
    return TransformationSettingsFactory();
  }

  reduce(
    state: TransformationSettings,
    action: Action
  ): TransformationSettings {
    switch (action.type) {
      case SettingsActionTypes.EDIT_ADS_RAW_HTML:
        return state.set(
          'adsSettings',
          state.get('adsSettings').set('rawHtml', action.adsRawHtml || '')
        );
      case SettingsActionTypes.EDIT_ADS_TYPE:
        return state.set(
          'adsSettings',
          state.get('adsSettings').set('type', action.adsType || '')
        );
      case SettingsActionTypes.EDIT_ANALYTICS_RAW_HTML:
        return state.set(
          'analyticsSettings',
          state
            .get('analyticsSettings')
            .set('rawHtml', action.analyticsRawHtml || '')
        );
      case SettingsActionTypes.EDIT_AUDIENCE_NETWORK_PLACEMENT_ID:
        return state.set(
          'adsSettings',
          state
            .get('adsSettings')
            .set(
              'audienceNetworkPlacementId',
              action.audienceNetworkPlacementId || ''
            )
        );
      case SettingsActionTypes.EDIT_FB_PIXEL_ID:
        return state.set(
          'analyticsSettings',
          state
            .get('analyticsSettings')
            .set('fbPixelId', action.fbPixelId || '')
        );
      case SettingsActionTypes.EDIT_STYLE_NAME:
        return state.set('styleName', action.styleName || '');

      default:
        return state;
    }
  }
}

module.exports = new SettingsStore();
