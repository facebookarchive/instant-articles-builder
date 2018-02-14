/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RulePropertyUtils } from '../RulePropertyUtils';
import { RulePropertyFactory } from '../../models/RuleProperty';
import RulePropertyTypes from '../../models/RulePropertyTypes';

describe('RulePropertyUtils', () => {
  describe('isValid', () => {
    it('should be false for property without selector', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({});
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(false);
    });

    it('should be true for element type property with selector', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({
        type: RulePropertyTypes.ELEMENT,
        selector: '.some-selector',
      });
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(true);
    });

    it('should be false for string type property without attribute', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({
        type: RulePropertyTypes.STRING,
        selector: '.some-selector',
      });
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(false);
    });

    it('should be true for string type property with attribute', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({
        type: RulePropertyTypes.STRING,
        selector: '.some-selector',
        attribute: 'some-attribute',
      });
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(true);
    });

    it('should be false for datetime type property without format', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({
        type: RulePropertyTypes.DATETIME,
        selector: '.some-selector',
        attribute: 'some-attribute',
      });
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(false);
    });

    it('should be true for datetime type property with format', () => {
      const ruleProperty: RuleProperty = RulePropertyFactory({
        type: RulePropertyTypes.DATETIME,
        selector: '.some-selector',
        attribute: 'some-attribute',
        format: 'some-format',
      });
      expect(RulePropertyUtils.isValid(ruleProperty)).toBe(true);
    });
  });
});
