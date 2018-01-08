/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OrderedMap, List } from 'immutable';
import RuleStore from '../RuleStore';
import RuleActionTypes from '../RuleActionTypes';
import RuleActions from '../RuleActions';
import { RuleFactory } from '../../models/Rule';

describe('RuleStore', () => {
  it('should preserve the insertion order of the rules in the list', () => {
    const first = RuleFactory({ selector: 'first' });
    const second = RuleFactory({ selector: 'second' });
    const third = RuleFactory({ selector: 'third' });

    RuleActions.removeAllRules();
    RuleActions.addRule(first);
    RuleActions.addRule(second);
    RuleActions.addRule(third);

    const state = RuleStore.getState();
    expect(state.valueSeq().get(0)).toEqual(first);
    expect(state.valueSeq().get(1)).toEqual(second);
    expect(state.valueSeq().get(2)).toEqual(third);
  });

  it('should allow changing the order of the rules', () => {
    const first = RuleFactory({ selector: 'first' });
    const second = RuleFactory({ selector: 'second' });
    const third = RuleFactory({ selector: 'third' });

    RuleActions.removeAllRules();
    RuleActions.addRule(first);
    RuleActions.addRule(second);
    RuleActions.addRule(third);
    RuleActions.changeOrder(0, 2);

    const state = RuleStore.getState();
    expect(state.valueSeq().get(0)).toEqual(second);
    expect(state.valueSeq().get(1)).toEqual(third);
    expect(state.valueSeq().get(2)).toEqual(first);
  });
});
