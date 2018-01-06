/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map } from 'immutable';
import RuleExporter from '../RuleExporter';
import { RuleFactory } from '../../models/Rule';
import { RuleDefinitionFactory } from '../../models/RuleDefinition';

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
});
