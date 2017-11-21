/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AttributeChangedArgs } from './AttributeChangedArgs';

export type RuleAttributeChangedArgs = {
  // See: https://github.com/facebook/flow/issues/4878
  // ...AttributeChangedArgs,
  ...$Exact<AttributeChangedArgs>,
  ruleKey: string
};
