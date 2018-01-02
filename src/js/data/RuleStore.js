/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const Immutable = require('immutable');
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import EditorActions from './EditorActions';
import { ReduceStore } from 'flux/utils';
import RuleActionTypes from './RuleActionTypes.js';
import { RuleFactory } from '../models/Rule';
import { RulePropertyFactory } from '../models/RuleProperty';
import type { Rule } from '../models/Rule';
import type { Field } from '../models/Field';
import type { RuleActionType } from './RuleActionTypes.js';

type Action = { type: RuleActionType, rule?: Rule, field?: Field };
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
        if (action.rule == null) {
          return state;
        }
        return state.set(action.rule.guid, action.rule);

      case RuleActionTypes.EDIT_FIELD:
        if (action.field == null) {
          return state;
        }
        let field = action.field;
        if (field.fieldType === 'Rule') {
          return state.set(field.guid, field);
        }
        if (field.fieldType === 'RuleProperty' && field.rule != null) {
          return state.setIn(
            [field.rule.guid, 'properties', field.definition.name],
            field
          );
        }
        return state;

      case RuleActionTypes.REMOVE_RULE:
        if (action.rule == null) {
          return state;
        }
        return state.delete(action.rule.guid);

      case RuleActionTypes.REMOVE_ALL_RULES:
        return this.getInitialState();

      default:
        return state;
    }
  }
}

module.exports = new RuleStore();
