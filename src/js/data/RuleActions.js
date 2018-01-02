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
import type { RuleProperty } from '../models/RuleProperty';
import type { Field } from '../models/Field';

import RuleActionTypes from './RuleActionTypes.js';

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
  }
  static editField(field: Field) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.EDIT_FIELD,
      field,
    });
  }
}

module.exports = RuleActions;
