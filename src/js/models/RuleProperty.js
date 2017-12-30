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
import { RuleFactory } from './Rule';
import { RulePropertyDefinitionFactory } from './RulePropertyDefinition';

import type { RecordOf, RecordFactory } from 'immutable';
import type { Rule } from './Rule';
import type { RulePropertyDefinition } from './RulePropertyDefinition';
import type { RulePropertyType } from './RulePropertyTypes.js';

type RulePropertyRecord = {
  definition: RulePropertyDefinition,
  selector: ?string,
  type: ?RulePropertyType,
  attribute: ?string,
  format: ?string
};

export const RulePropertyFactory: RecordFactory<RulePropertyRecord> = Record({
  definition: RulePropertyDefinitionFactory(),
  selector: null,
  type: null,
  attribute: null,
  format: null,
});

export type RuleProperty = RecordOf<RulePropertyRecord>;
