/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import Immutable from 'immutable';
import type { Rule } from '../models/Rule';
import type { RuleProperty } from '../models/RuleProperty';
import type { RuleDefinition } from '../models/RuleDefinition';
import type { RulePropertyDefinition } from '../models/RulePropertyDefinition';
import RuleActions from '../data/RuleActions';
import { RuleFactory } from '../models/Rule';
import { RulePropertyFactory } from '../models/RuleProperty';
import RulePropertyTypes from '../models/RulePropertyTypes';

type JSONFormat = {
  rules: RuleJSON[]
};

type RulePropertyJSON = {
  attribute: ?string,
  dateTimeFormat?: string,
  selector: string,
  type: string
};

type RuleJSON = {
  class: string,
  selector?: string,
  properties?: { [string]: RulePropertyJSON }
};

class RuleUtils {
  static import(
    data: string,
    ruleDefinitions: Immutable.Map<string, RuleDefinition>
  ) {
    let json: JSONFormat = JSON.parse(data);
    let rulesJSON: RuleJSON[] = json.rules;
    let rules = rulesJSON.map(ruleJSON =>
      this.createRuleFromJSON(ruleJSON, ruleDefinitions.get(ruleJSON.class))
    );
    // Register all rules on the store
    RuleActions.removeAllRules();
    rules
      .filter(rule => rule != null)
      .forEach(rule => (rule != null ? RuleActions.addRule(rule) : null));
  }

  static export(rules: Immutable.Map<string, Rule>): JSONFormat {
    return {
      rules: [
        { class: 'TextNodeRule' },
        ...Array.from(
          rules
            .map((rule: Rule): ?RuleJSON => this.createJSONFromRule(rule))
            .filter(Boolean)
            .values()
        ),
      ],
    };
  }

  static createJSONFromRule(rule: Rule): ?RuleJSON {
    if (rule.selector != null) {
      let properties = this.createJSONFromRuleProperties(rule.properties);
      return {
        class: rule.definition.name,
        selector: rule.selector,
        ...(properties != null ? { properties } : {}),
      };
    }
  }

  static createJSONFromRuleProperties(
    properties: ?Immutable.Map<string, RuleProperty>
  ): ?{ [string]: RulePropertyJSON } {
    if (properties != null) {
      return properties
        .map(property => this.createJSONFromRuleProperty(property))
        .filter(Boolean)
        .toJSON();
    }
  }

  static createJSONFromRuleProperty(property: RuleProperty): ?RulePropertyJSON {
    if (property != null && property.selector != null) {
      return {
        ...(property.attribute != null && property.attribute != 'content'
          ? { attribute: property.attribute }
          : {}),
        selector: property.selector,
        type:
          property.attribute == 'content'
            ? RulePropertyTypes.ELEMENT
            : property.definition.supportedTypes.first() ||
              RulePropertyTypes.STRING,
      };
    }
  }

  static createRuleFromJSON(
    ruleJSON: RuleJSON,
    ruleDefinition: ?RuleDefinition
  ): ?Rule {
    if (ruleDefinition != null) {
      return RuleFactory({
        definition: ruleDefinition,
        selector: ruleJSON.selector || '',
        properties: this.createRulePropertiesFromJSON(
          ruleJSON.properties,
          ruleDefinition
        ),
      });
    }
  }

  static createRulePropertiesFromJSON(
    rulePropertiesJSON: ?{ [string]: RulePropertyJSON },
    ruleDefinition: RuleDefinition
  ): Immutable.Map<string, RuleProperty> {
    if (rulePropertiesJSON != null && ruleDefinition != null) {
      return Immutable.Map(rulePropertiesJSON)
        .map(
          (rulePropertyJSON: RulePropertyJSON, name: string): ?RuleProperty => {
            return this.createRulePropertyFromJSON(
              rulePropertyJSON,
              ruleDefinition.properties.get(name)
            );
          }
        )
        .filter(Boolean);
    }
    return Immutable.Map();
  }

  static createRulePropertyFromJSON(
    rulePropertyJSON: RulePropertyJSON,
    rulePropertyDefinition: ?RulePropertyDefinition
  ): ?RuleProperty {
    if (rulePropertyDefinition != null) {
      return RulePropertyFactory({
        definition: rulePropertyDefinition,
        selector: rulePropertyJSON.selector,
        attribute: rulePropertyJSON.attribute,
        format: rulePropertyJSON.dateTimeFormat,
      });
    }
  }
}

export default RuleUtils;
