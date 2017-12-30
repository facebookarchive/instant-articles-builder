/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Map, Record } from 'immutable';
import type { Rule } from './Rule';
import type { RuleProperty } from './RuleProperty';
import type { Attribute } from '../models/Attribute';

import type { RecordOf, RecordFactory } from 'immutable';

type EditorRecord = {
  attributes: Map<string, Map<string, Attribute>>,
  finding: ?RuleProperty | ?Rule
};

const BaseEditorFactory: RecordFactory<EditorRecord> = Record({
  attributes: Map(),
  finding: null,
});

export class EditorFactory extends BaseEditorFactory {}

export type Editor = RecordOf<EditorRecord>;
