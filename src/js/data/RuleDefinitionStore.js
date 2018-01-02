/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { ReduceStore } from 'flux/utils';
const Immutable = require('immutable');
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import type { RuleDefinition } from '../models/RuleDefinition';
import type { RuleDefinitionActionType } from './RuleDefinitionActionTypes.js';
import RuleDefinitionActionTypes from './RuleDefinitionActionTypes.js';

type Action = {
  type: RuleDefinitionActionType,
  ruleDefinition: RuleDefinition
};

export type State = Immutable.Map<string, RuleDefinition>;

class RuleDefinitionStore extends ReduceStore<State> {
  constructor() {
    super(RulesEditorDispatcher);
  }

  getInitialState(): State {
    return Immutable.Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case RuleDefinitionActionTypes.ADD_RULE_DEFINITION:
        return state.set(action.ruleDefinition.name, action.ruleDefinition);

      case RuleDefinitionActionTypes.REMOVE_RULE_DEFINITION:
        return state.delete(action.ruleDefinition.name);

      case RuleDefinitionActionTypes.REMOVE_ALL:
        return this.getInitialState();

      default:
        return state;
    }
  }
}

module.exports = new RuleDefinitionStore();
