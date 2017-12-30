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
  START_FINDING: 'START_FINDING',
  FOUND: 'FOUND',
  STOP_FINDING: 'STOP_FINDING',
};

export type EditorActionType = $Values<typeof EditorActionTypes>;

export default EditorActionTypes;
