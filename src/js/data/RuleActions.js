/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');
import type { Rule } from '../models/Rule';
import type { Field } from '../models/Field';

import RuleActionTypes from './RuleActionTypes.js';
import EditorActions from './EditorActions';

class RuleActions {
  static addRule(rule: Rule) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.ADD_RULE,
      rule,
    });
  }
  static removeRule(rule: Rule) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.REMOVE_RULE,
      rule,
    });
    EditorActions.blur();
  }
  static removeAllRules() {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.REMOVE_ALL_RULES,
    });
    EditorActions.blur();
  }
  static editField(field: Field) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.EDIT_FIELD,
      field,
    });
    EditorActions.focusField(field);
  }
  static changeOrder(oldIndex: number, newIndex: number) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.CHANGE_ORDER,
      oldIndex,
      newIndex,
    });
  }
}

module.exports = RuleActions;
