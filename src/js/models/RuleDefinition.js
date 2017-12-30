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

type RuleDefinitionRecord = {
  className: string,
  displayName: string,
  placeholder: string,
  properties: Map<string, RulePropertyDefinition>
};

export const RuleDefinitionFactory: RecordFactory<
  RuleDefinitionRecord
> = Record({
  className: '',
  displayName: '',
  placeholder: '',
  properties: Map(),
});

export type RuleDefinition = RecordOf<RuleDefinitionRecord>;
