/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Record, Set } from 'immutable';

import type { RulePropertyType } from './RulePropertyTypes.js';
import type { RecordOf, RecordFactory } from 'immutable';

type RulePropertyDefinitionRecord = {
  name: string,
  displayName: string,
  placeholder: string,
  defaultAttribute: ?string,
  supportedTypes: Set<RulePropertyType>,
  required: boolean,
  unique: boolean
};

export const RulePropertyDefinitionFactory: RecordFactory<
  RulePropertyDefinitionRecord
> = Record({
  name: '',
  displayName: '',
  placeholder: '',
  defaultAttribute: null,
  supportedTypes: Set(),
  required: false,
  unique: false,
});

export type RulePropertyDefinition = RecordOf<RulePropertyDefinitionRecord> &
  RulePropertyDefinitionFactory;
