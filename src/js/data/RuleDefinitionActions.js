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
import type { RuleDefinition } from '../models/RuleDefinition';

import RuleDefinitionActionTypes from './RuleDefinitionActionTypes.js';

class RuleDefinitionActions {
  static addRuleDefinition(rule: RuleDefinition) {
    RulesEditorDispatcher.dispatch({
      type: RuleDefinitionActionTypes.ADD_RULE_DEFINITION,
      rule,
    });
  }
  static removeRuleDefinition(rule: RuleDefinition) {
    RulesEditorDispatcher.dispatch({
      type: RuleDefinitionActionTypes.REMOVE_RULE_DEFINITION,
      rule,
    });
  }
}

module.exports = RuleDefinitionActions;
