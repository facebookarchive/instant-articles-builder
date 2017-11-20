/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { SelectorFindArgsType } from './SelectorFindArgsType';

export type RuleSelectorFindArgs = {
  // See: https://github.com/facebook/flow/issues/4878
  // ...SelectorFindArgsType,
  ...$Exact<SelectorFindArgsType>,
  findType: number,
  ruleKey: string
};
