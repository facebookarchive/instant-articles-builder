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

export type AnalyticsSettingsRecord = {
  fbPixelId: string,
  rawHtml: string
};

export const AnalyticsSettingsFactory: RecordFactory<
  AnalyticsSettingsRecord
> = Record({
  fbPixelId: '',
  rawHtml: '',
});

export type AnalyticsSettings = RecordOf<AnalyticsSettingsRecord> &
  AnalyticsSettingsFactory;
