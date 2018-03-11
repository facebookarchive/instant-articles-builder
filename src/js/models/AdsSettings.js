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

export type AdsSettingsRecord = {
  audienceNetworkPlacementId: string,
  rawHtml: string
};

export const AdsSettingsFactory: RecordFactory<AdsSettingsRecord> = Record({
  audienceNetworkPlacementId: '',
  rawHtml: '',
});

export type AdsSettings = RecordOf<AdsSettingsRecord> & AdsSettingsFactory;
