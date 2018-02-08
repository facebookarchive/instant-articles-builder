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
import { RulePropertyDefinitionFactory } from './RulePropertyDefinition';

import type { RecordOf, RecordFactory } from 'immutable';
import type { Rule } from './Rule';
import type { RulePropertyDefinition } from './RulePropertyDefinition';
import type { RulePropertyType } from './RulePropertyTypes.js';
import RulePropertyTypes from './RulePropertyTypes';

type RulePropertyRecord = {
  fieldType: 'RuleProperty',
  definition: RulePropertyDefinition,
  selector: string,
  type: ?RulePropertyType,
  attribute: ?string,
  format: string,
  rule: ?Rule
};

export const RulePropertyFactory: RecordFactory<RulePropertyRecord> = Record({
  fieldType: 'RuleProperty',
  definition: RulePropertyDefinitionFactory(),
  selector: '',
  type: null,
  attribute: null,
  format: '',
  rule: null,
});

export class RulePropertyUtils {
  static isValid(ruleProperty: RuleProperty): boolean {
    if (ruleProperty.selector == '' || ruleProperty.selector == null) {
      return false;
    }
    if (
      ruleProperty.type != RulePropertyTypes.ELEMENT &&
      ruleProperty.attribute == null &&
      ruleProperty.definition.defaultAttribute == null
    ) {
      return false;
    }
    if (
      ruleProperty.type == RulePropertyTypes.DATETIME &&
      ruleProperty.format == ''
    ) {
      return false;
    }
    return true;
  }
}

export type RuleProperty = RecordOf<RulePropertyRecord> & RulePropertyFactory;
