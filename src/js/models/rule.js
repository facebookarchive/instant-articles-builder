/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Record, Map, Seq } from 'immutable';
import { RuleDefinitionFactory } from './RuleDefinition.js';
import type { RuleDefinition } from './RuleDefinition.js';
import type { RuleProperty } from './RuleProperty';

import type { RecordOf, RecordFactory } from 'immutable';

type RuleRecord = {
  guid: string,
  definition: RuleDefinition,
  properties: Map<string, RuleProperty>,
  selector: ?string
};

export const RuleFactory: RecordFactory<RuleRecord> = Record({
  guid: '',
  definition: RuleDefinitionFactory(),
  properties: Map(),
  selector: null,
});

export type Rule = RecordOf<RuleRecord>;
