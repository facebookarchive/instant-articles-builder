/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const { ReduceStore } = require('flux');
const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import { Record, Map } from 'immutable';
import type { RecordOf, RecordFactory } from 'immutable';
import type { RuleProperty } from '../models/RuleProperty';
import type { Rule } from '../models/Rule';

import EditorActionTypes from './EditorActionTypes.js';
import { EditorFactory } from '../models/Editor';
import type { Attribute } from '../models/Attribute';
import type { EditorActionType } from './EditorActionTypes.js';
import type { Editor } from '../models/Editor';

type Action = {
  type: EditorActionType,
  target?: RuleProperty | Rule,
  attributes?: Map<string, Attribute>
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
        return state.set('finding', action.target);

      case EditorActionTypes.STOP_FINDING:
        return state.remove('finding');

      case EditorActionTypes.FOUND:
        if (
          state.finding != null &&
          state.finding.selector != null &&
          action.attributes != null
        ) {
          state = state.setIn(
            ['attributes', state.finding.selector],
            action.attributes
          );
        }
        return state.remove('finding');

      default:
        return state;
    }
  }
}

module.exports = new EditorStore();
