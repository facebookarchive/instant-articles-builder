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
import { RuleDefinitionFactory } from './RuleDefinition.js';
import { RulePropertyFactory } from './RuleProperty';
import { RulePropertyUtils } from './RuleProperty';
import type { RuleDefinition } from './RuleDefinition.js';
import type { RuleProperty } from './RuleProperty';

import type { RecordOf, RecordFactory } from 'immutable';

type RuleRecord = {
  fieldType: 'Rule',
  guid: string,
  definition: RuleDefinition,
  properties: Map<string, RuleProperty>,
  selector: string
};

const BaseRuleFactory: RecordFactory<RuleRecord> = Record({
  fieldType: 'Rule',
  guid: '',
  definition: RuleDefinitionFactory(),
  properties: Map(),
  selector: '',
});

// Private counter for generating guid
let counter = 0;

export const RuleFactory = (values: $Shape<RuleRecord>): Rule => {
  let rule: Rule = BaseRuleFactory(values);

  // Generates a guid if none is provided
  rule = rule.update('guid', guid => (guid == '' ? 'rule-' + counter++ : guid));
  // Sets the rule of child properties to the right parent
  rule = rule.update('properties', properties =>
    properties.map(property => property.set('rule', rule))
  );
  // Add any missing property from the definition
  rule = rule.update('properties', properties =>
    rule.definition.properties.map(definition => {
      let property = properties.get(definition.name);
      if (property != null) {
        return property.set('definition', definition);
      }
      if (definition.defaultProperty != null) {
        return definition.defaultProperty;
      }
      return RulePropertyFactory({ rule, definition });
    })
  );

  return rule;
};

export class RuleUtils {
  static isValid(rule: Rule) {
    if (rule.selector == '' || rule.selector == null) {
      return false;
    }
    return rule.properties
      .filter(property => property.definition.required)
      .every(property => RulePropertyUtils.isValid(property));
  }
}

export type Rule = RecordOf<RuleRecord> & RuleFactory;
