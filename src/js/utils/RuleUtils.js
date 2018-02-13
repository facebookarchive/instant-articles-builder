/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { Rule } from '../models/Rule';
import { RulePropertyUtils } from './RulePropertyUtils';

export class RuleUtils {
  static isValid(rule: Rule) {
    if (rule.selector == '' || rule.selector == null) {
      return false;
    }
    return rule.properties
      .filter(property => property.definition.required)
      .every(property => RulePropertyUtils.isValid(property));
  }
}
