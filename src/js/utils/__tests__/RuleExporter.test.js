/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map, Set } from 'immutable';
import RuleExporter from '../RuleExporter';
import { RuleFactory } from '../../models/Rule';
import { RuleDefinitionFactory } from '../../models/RuleDefinition';
import { RulePropertyDefinitionFactory } from '../../models/RulePropertyDefinition';
import { RulePropertyFactory } from '../../models/RuleProperty';
import RulePropertyTypes from '../../models/RulePropertyTypes';

// Rules that are always included in the exported file
const defaultExportedRules = [{ class: 'TextNodeRule' }];

describe('RuleExporter', () => {
  it('should export only default rules if none configured', () => {
    const exportedRules = RuleExporter.export(Map());
    expect(exportedRules.rules).toEqual(defaultExportedRules);
  });

  it('should export only valid configured rules', () => {
    const exportedRules = RuleExporter.export(
      Map({
        'valid-rule': RuleFactory({
          definition: RuleDefinitionFactory({
            name: 'ValidRule',
          }),
          selector: '.some-selector',
        }),
        'invalid-rule': RuleFactory(),
      })
    );
    expect(exportedRules.rules).toEqual([
      ...defaultExportedRules,
      { class: 'ValidRule', selector: '.some-selector' },
    ]);
  });

  it('should export only valid configured rule properties', () => {
    const exportedRules = RuleExporter.export(
      Map({
        'valid-rule': RuleFactory({
          definition: RuleDefinitionFactory({
            name: 'ValidRule',
            properties: Map({
              'valid-property': RulePropertyDefinitionFactory({
                name: 'valid-property',
                supportedTypes: Set([RulePropertyTypes.ELEMENT]),
              }),
              'invalid-property': RulePropertyDefinitionFactory({
                name: 'invalid-property',
              }),
            }),
          }),
          properties: Map({
            'valid-property': RulePropertyFactory({
              type: RulePropertyTypes.ELEMENT,
              selector: '.some-selector',
            }),
            'invalid-property': RulePropertyFactory(),
          }),
          selector: '.some-selector',
        }),
      })
    );
    expect(exportedRules.rules).toEqual([
      ...defaultExportedRules,
      {
        class: 'ValidRule',
        selector: '.some-selector',
        properties: {
          'valid-property': {
            type: RulePropertyTypes.ELEMENT,
            selector: '.some-selector',
          },
        },
      },
    ]);
  });
});
