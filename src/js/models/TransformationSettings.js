/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Record } from 'immutable';
import type { RecordOf, RecordFactory } from 'immutable';

import { AdsSettingsFactory } from './AdsSettings';
import { AnalyticsSettingsFactory } from './AnalyticsSettings';

import type { AdsSettings } from './AdsSettings';
import type { AnalyticsSettings } from './AnalyticsSettings';

export type TransformationSettingsRecord = {
  adsSettings: AdsSettings,
  analyticsSettings: AnalyticsSettings,
  styleName: string
};

export const TransformationSettingsFactory: RecordFactory<
  TransformationSettingsRecord
> = Record({
  adsSettings: AdsSettingsFactory(),
  analyticsSettings: AnalyticsSettingsFactory(),
  styleName: '',
});

export type TransformationSettings = RecordOf<TransformationSettingsRecord> &
  TransformationSettingsFactory;
