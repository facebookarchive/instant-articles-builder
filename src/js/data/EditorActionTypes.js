/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const EditorActionTypes = {
  FOCUS_FIELD: 'FOCUS_FIELD',
  BLUR: 'BLUR',
  START_FINDING: 'START_FINDING',
  STOP_FINDING: 'STOP_FINDING',
  FOUND: 'FOUND',
};

export type EditorActionType = $Values<typeof EditorActionTypes>;

export default EditorActionTypes;
