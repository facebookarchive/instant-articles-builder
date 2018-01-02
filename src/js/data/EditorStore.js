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
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import { Record, Map } from 'immutable';
import type { RecordOf, RecordFactory } from 'immutable';
import type { RuleProperty } from '../models/RuleProperty';
import type { Rule } from '../models/Rule';
import type { Field } from '../models/Field';

import EditorActionTypes from './EditorActionTypes.js';
import { EditorFactory } from '../models/Editor';
import type { Attribute } from '../models/Attribute';
import type { EditorActionType } from './EditorActionTypes.js';
import type { Editor } from '../models/Editor';

type Action = {
  type: EditorActionType,
  field?: Field,
  elementAttributes?: Map<string, Attribute>,
  elementCount: ?number,
  selector: ?string
};

class EditorStore extends ReduceStore<Editor> {
  constructor() {
    super(RulesEditorDispatcher);
  }

  getInitialState(): Editor {
    return EditorFactory();
  }

  reduce(state: Editor, action: Action): Editor {
    switch (action.type) {
      case EditorActionTypes.START_FINDING:
        return state.set('focusedField', action.field).set('finding', true);

      case EditorActionTypes.STOP_FINDING:
        return state.set('finding', false);

      case EditorActionTypes.FOUND:
        if (
          state.focusedField != null &&
          action.elementAttributes != null &&
          action.elementCount != null
        ) {
          const selector: string = state.focusedField.selector;
          const elementCount: number = action.elementCount;
          const elementAttributes: Map<string, Attribute> =
            action.elementAttributes;

          state = state.update('elementCounts', counts =>
            counts.set(selector, elementCount)
          );
          state = state.update('elementAttributes', attributes =>
            attributes.set(selector, elementAttributes)
          );
        }
        return state.set('finding', false);

      default:
        return state;
    }
  }
}

module.exports = new EditorStore();
