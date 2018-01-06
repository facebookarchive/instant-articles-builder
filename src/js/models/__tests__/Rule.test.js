/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Rule } from '../Rule';
import { Map } from 'immutable';
import { RuleFactory } from '../Rule';
import { RulePropertyFactory } from '../RuleProperty';
import { RuleDefinitionFactory } from '../RuleDefinition';
import { RulePropertyDefinitionFactory } from '../RulePropertyDefinition';
import { RuleUtils } from '../Rule';
import RulePropertyTypes from '../RulePropertyTypes';

describe('RuleFactory', () => {
  it('should generate an unique GUID if none is provided', () => {
    const rule1: Rule = RuleFactory();
    const rule2: Rule = RuleFactory();

    expect(rule1.guid).not.toEqual(rule2.guid);
  });

  it('should use the provided GUID', () => {
    const providedGUID: string = 'provided-GUID';
    const rule: Rule = RuleFactory({ guid: providedGUID });

    expect(rule.guid).toEqual(providedGUID);
  });

  it('should set the rule of child properties to a copy of itself', () => {
    const rule: Rule = RuleFactory({
      definition: RuleDefinitionFactory({
        properties: Map({
          property1: RulePropertyDefinitionFactory({ name: 'property1' }),
          property2: RulePropertyDefinitionFactory({ name: 'property2' }),
        }),
      }),
      properties: Map({
        property1: RulePropertyFactory(),
        property2: RulePropertyFactory(),
      }),
    });

    expect(rule.properties.get('property1').rule.guid).toEqual(rule.guid);
    expect(rule.properties.get('property2').rule.guid).toEqual(rule.guid);
  });

  it('should add any missing property from the definition', () => {
    const rule: Rule = RuleFactory({
      definition: RuleDefinitionFactory({
        properties: Map({
          property1: RulePropertyDefinitionFactory({ name: 'property1' }),
          property2: RulePropertyDefinitionFactory({ name: 'property2' }),
        }),
      }),
      properties: Map({
        property1: RulePropertyFactory(),
        // missing property2
      }),
    });

    expect(rule.properties.get('property2')).not.toBeUndefined();
  });

  it('should use a defaultProperty from the definition', () => {
    const rule: Rule = RuleFactory({
      definition: RuleDefinitionFactory({
        properties: Map({
          property1: RulePropertyDefinitionFactory({ name: 'property1' }),
          property2: RulePropertyDefinitionFactory({
            name: 'property2',
            defaultProperty: RulePropertyFactory({ selector: '.default' }),
          }),
        }),
      }),
      properties: Map({
        property1: RulePropertyFactory(),
        // missing property2
      }),
    });

    expect(rule.properties.get('property2')).not.toBeUndefined();
    expect(rule.properties.get('property2').selector).toEqual('.default');
  });

  it('should ignore property not present on the definition', () => {
    const rule: Rule = RuleFactory({
      definition: RuleDefinitionFactory({
        properties: Map({
          property1: RulePropertyDefinitionFactory({ name: 'property1' }),
          // missing property2 from definiton
        }),
      }),
      properties: Map({
        property1: RulePropertyFactory(),
        property2: RulePropertyFactory(),
      }),
    });

    expect(rule.properties.get('property2')).toBeUndefined();
  });
});

describe('RuleUtils', () => {
  describe('isValid', () => {
    it('should be false for rule without selector', () => {
      const rule: Rule = RuleFactory();
      expect(RuleUtils.isValid(rule)).toBe(false);
    });

    it('should be true for rule with selector', () => {
      const rule: Rule = RuleFactory({
        selector: '.some-selector',
      });
      expect(RuleUtils.isValid(rule)).toBe(true);
    });

    it('should be false for rule with invalid required properties', () => {
      const rule: Rule = RuleFactory({
        selector: '.some-selector',
        definition: RuleDefinitionFactory({
          properties: Map({
            'invalid-property': RulePropertyDefinitionFactory({
              name: 'invalid-property',
              required: true,
            }),
          }),
        }),
        properties: Map({
          'invalid-property': RulePropertyFactory(),
        }),
      });
      expect(RuleUtils.isValid(rule)).toBe(false);
    });

    it('should be true for rule with invalid non-required properties', () => {
      const rule: Rule = RuleFactory({
        selector: '.some-selector',
        definition: RuleDefinitionFactory({
          properties: Map({
            'invalid-property': RulePropertyDefinitionFactory({
              name: 'invalid-property',
            }),
          }),
        }),
        properties: Map({
          'invalid-property': RulePropertyFactory(),
        }),
      });
      expect(RuleUtils.isValid(rule)).toBe(true);
    });

    it('should be true for rule with valid required properties', () => {
      const rule: Rule = RuleFactory({
        selector: '.some-selector',
        definition: RuleDefinitionFactory({
          properties: Map({
            'valid-property': RulePropertyDefinitionFactory({
              name: 'valid-property',
              required: true,
            }),
          }),
        }),
        properties: Map({
          'valid-property': RulePropertyFactory({
            type: RulePropertyTypes.ELEMENT,
            selector: '.some-selector',
          }),
        }),
      });
      expect(RuleUtils.isValid(rule)).toBe(true);
    });
  });
});
