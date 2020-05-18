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

import { ReduceStore } from 'flux/utils';
import RuleActionTypes from './RuleActionTypes.js';
import type { Rule } from '../models/Rule';
import type { Field } from '../models/Field';
import type { RuleActionType } from './RuleActionTypes.js';

type Action = {
  type: RuleActionType,
  rule?: Rule,
  field?: Field,
  oldIndex?: number,
  newIndex?: number,
};
export type State = Immutable.Map<string, Rule>;

class RuleStore extends ReduceStore<State> {
  constructor() {
    super(RulesEditorDispatcher);
  }

  getInitialState(): State {
    return Immutable.OrderedMap();
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

      case RuleActionTypes.CHANGE_ORDER:
        const oldIndex = action.oldIndex;
        const newIndex = action.newIndex;
        if (oldIndex == null || newIndex == null) {
          return state;
        }
        const lowerIndex = Math.min(oldIndex, newIndex);
        const upperIndex = Math.max(oldIndex, newIndex);

        return state.sortBy(rule => {
          let index = [...state.keys()].indexOf(rule.guid);
          if (index < lowerIndex || index > upperIndex) {
            return index;
          }
          if (index == oldIndex) {
            return newIndex;
          }
          if (oldIndex > newIndex) {
            return index + 1;
          }
          return index - 1;
        });

      default:
        return state;
    }
  }
}

module.exports = new RuleStore();
