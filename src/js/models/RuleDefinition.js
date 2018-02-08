/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Record, Map } from 'immutable';
import type { RecordOf, RecordFactory } from 'immutable';
import type { RulePropertyDefinition } from './RulePropertyDefinition';
import type { RuleCategory } from './RuleCategories';
import RuleCategories from './RuleCategories';

type RuleDefinitionRecord = {
  name: string,
  category: RuleCategory,
  displayName: string,
  placeholder: string,
  properties: Map<string, RulePropertyDefinition>,
  unique: boolean
};

export const RuleDefinitionFactory: RecordFactory<
  RuleDefinitionRecord
> = Record({
  name: '',
  category: RuleCategories.BASIC,
  displayName: '',
  placeholder: '',
  properties: Map(),
  unique: false,
});

export type RuleDefinition = RecordOf<RuleDefinitionRecord> &
  RuleDefinitionFactory;
