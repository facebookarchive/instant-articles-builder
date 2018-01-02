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

type AttributeRecord = {
  name: string,
  value: string
};

export const AttributeFactory: RecordFactory<AttributeRecord> = Record({
  name: '',
  value: '',
});

export type Attribute = RecordOf<AttributeRecord> & AttributeFactory;
