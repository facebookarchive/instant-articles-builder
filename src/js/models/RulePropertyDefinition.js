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

import type { RuleProperty } from './RuleProperty';
import type { RulePropertyType } from './RulePropertyTypes.js';
import type { RecordOf, RecordFactory } from 'immutable';

/**
 * @property {?RuleProperty} defaultProperty a default pre-filled property for this definition.
 */
type RulePropertyDefinitionRecord = {
  name: string,
  displayName: string,
  placeholder: string,
  defaultAttribute: ?string,
  supportedTypes: Set<RulePropertyType>,
  required: boolean,
  unique: boolean,
  defaultProperty: ?RuleProperty
};

const BaseRulePropertyDefinitionFactory: RecordFactory<
  RulePropertyDefinitionRecord
> = Record({
  name: '',
  displayName: '',
  placeholder: '',
  defaultAttribute: null,
  supportedTypes: Set(),
  required: false,
  unique: false,
  defaultProperty: null,
});

export const RulePropertyDefinitionFactory = (
  values: $Shape<RulePropertyDefinitionRecord>
): RulePropertyDefinition => {
  let rulePropertyDefinition: RulePropertyDefinition = BaseRulePropertyDefinitionFactory(
    values
  );
  if (rulePropertyDefinition.defaultProperty != null) {
    rulePropertyDefinition = rulePropertyDefinition.setIn(
      ['defaultProperty', 'definition'],
      rulePropertyDefinition
    );
  }
  return rulePropertyDefinition;
};

export type RulePropertyDefinition = RecordOf<RulePropertyDefinitionRecord> &
  RulePropertyDefinitionFactory;
