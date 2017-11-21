/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { InputPropertyType } from './InputPropertyType';

export type InputRuleType = {
  class: string,
  defaultSelector: string,
  properties: Map<string, InputPropertyType>,
  showByDefault: boolean
};
