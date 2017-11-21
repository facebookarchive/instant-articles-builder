/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { InputProperty } from './InputProperty';

export type InputRule = {
  class: string,
  defaultSelector: string,
  properties: Map<string, InputProperty>,
  showByDefault: boolean
};
