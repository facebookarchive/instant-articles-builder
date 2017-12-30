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
import type { Attribute } from '../models/Attribute';
import EditorActionTypes from './EditorActionTypes.js';

class EditorActions {
  static startFinding(target: RuleProperty | Rule) {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.START_FINDING,
      target,
    });
  }
  static stopFinding() {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.STOP_FINDING,
    });
  }
  static found(target: RuleProperty | Rule, attributes: Attribute[]) {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.FOUND,
      target,
      attributes,
    });
  }
}

module.exports = EditorActions;
