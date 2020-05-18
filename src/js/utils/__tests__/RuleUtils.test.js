/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RuleFactory } from '../../models/Rule';
import { RulePropertyFactory } from '../../models/RuleProperty';
import { RuleDefinitionFactory } from '../../models/RuleDefinition';
import { RulePropertyDefinitionFactory } from '../../models/RulePropertyDefinition';
import { RuleUtils } from '../RuleUtils';
import RulePropertyTypes from '../../models/RulePropertyTypes';
import { Map, Set } from 'immutable';

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
              supportedTypes: Set([RulePropertyTypes.ELEMENT]),
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
