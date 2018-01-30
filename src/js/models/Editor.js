/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Map, Set, Record } from 'immutable';
import type { Attribute } from '../models/Attribute';
import type { RuleCategory } from './RuleCategories';
import RuleCategories from './RuleCategories';
import type { Field } from './Field';
import type { RecordOf, RecordFactory } from 'immutable';

type EditorRecord = {
  elementAttributes: Map<string, Map<string, Attribute>>,
  elementCounts: Map<string, number>,
  focusedField: ?Field,
  finding: boolean,
  categories: Set<RuleCategory>
};

export const EditorFactory: RecordFactory<EditorRecord> = Record({
  elementAttributes: Map(),
  elementCounts: Map(),
  focusedField: null,
  finding: false,
  categories: Set([RuleCategories.BASIC]),
});

export type Editor = RecordOf<EditorRecord> & EditorFactory;
