/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { Attribute } from './Attribute';

export type AttributeChangedArgs = {
  attribute: Attribute,
  propertyName: string,
  propertySelector: ?string
};
