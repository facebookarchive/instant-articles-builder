/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const { ReduceStore } = require('flux');
const Immutable = require('immutable');
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');
import RuleActionTypes from './RuleActionTypes.js';

import type { Rule } from '../models/Rule';
import type { RuleActionType } from './RuleActionTypes.js';

type Action = { type: RuleActionType, rule: Rule };
export type State = Immutable.Map<string, Rule>;

class RuleStore extends ReduceStore<State> {
  constructor() {
    super(RulesEditorDispatcher);
  }

  getInitialState() {
    return Immutable.Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case RuleActionTypes.ADD_RULE:
        return state.set(action.rule.guid, action.rule);

      case RuleActionTypes.EDIT_RULE:
        if (!state.has(action.rule.guid)) {
          return state;
        }
        return state.set(action.rule.guid, action.rule);

      case RuleActionTypes.REMOVE_RULE:
        return state.delete(action.rule.guid);

      default:
        return state;
    }
  }
}

module.exports = new RuleStore();
