/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * This can be used as a enum.
 */
const RulePropertyTypes = {
  STRING: 'string',
  ELEMENT: 'element',
  INTEGER: 'int',
  DATETIME: 'date',
};

export type RulePropertyType = $Values<typeof RulePropertyTypes>;

export default RulePropertyTypes;
