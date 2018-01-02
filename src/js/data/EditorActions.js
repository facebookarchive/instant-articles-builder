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

import type { Attribute } from '../models/Attribute';
import type { Field } from '../models/Field';
import EditorActionTypes from './EditorActionTypes.js';

class EditorActions {
  static focusField(field: Field) {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.FOCUS_FIELD,
      field,
    });
  }
  static startFinding(field: Field) {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.START_FINDING,
      field,
    });
  }
  static stopFinding() {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.STOP_FINDING,
    });
  }
  static found(attributes: Attribute[], count: number) {
    RulesEditorDispatcher.dispatch({
      type: EditorActionTypes.FOUND,
      attributes,
      count,
    });
  }
}

module.exports = EditorActions;
