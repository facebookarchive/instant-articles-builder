/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RulePropertyDefinition } from '../RulePropertyDefinition';
import { RulePropertyFactory } from '../RuleProperty';
import { RulePropertyDefinitionFactory } from '../RulePropertyDefinition';

describe('RulePropertyDefinitionFactory', () => {
  it('should set the definition of the defaultProperty to a copy of itself', () => {
    const rulePropertyDefinition: RulePropertyDefinition = RulePropertyDefinitionFactory(
      {
        name: 'property1',
        defaultProperty: RulePropertyFactory(),
      }
    );

    expect(rulePropertyDefinition.defaultProperty.definition.name).toEqual(
      rulePropertyDefinition.name
    );
  });
});
