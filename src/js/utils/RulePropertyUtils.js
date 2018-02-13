/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { RuleProperty } from '../models/RuleProperty';
import RulePropertyTypes from '../models/RulePropertyTypes';

export class RulePropertyUtils {
  static isValid(ruleProperty: RuleProperty): boolean {
    if (ruleProperty.selector == '' || ruleProperty.selector == null) {
      return false;
    }
    if (
      ruleProperty.type != RulePropertyTypes.ELEMENT &&
      ruleProperty.attribute == null &&
      ruleProperty.definition.defaultAttribute == null
    ) {
      return false;
    }
    if (
      ruleProperty.type == RulePropertyTypes.DATETIME &&
      ruleProperty.format == ''
    ) {
      return false;
    }
    return true;
  }
}
