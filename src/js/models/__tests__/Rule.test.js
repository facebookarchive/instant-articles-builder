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

  it('should be the rule of the defaultProperties from the definition', () => {
    const rule: Rule = RuleFactory({
      definition: RuleDefinitionFactory({
        properties: Map({
          property: RulePropertyDefinitionFactory({
            defaultProperty: RulePropertyFactory({ selector: '.default' }),
          }),
        }),
      }),
    });

    expect(rule.properties.get('property')).not.toBeUndefined();
    expect(rule.properties.get('property').rule.guid).toEqual(rule.guid);
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
