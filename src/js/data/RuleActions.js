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
  static editRule(rule: Rule) {
    RulesEditorDispatcher.dispatch({
      type: RuleActionTypes.EDIT_RULE,
      rule,
    });
  }
}

module.exports = RuleActions;
