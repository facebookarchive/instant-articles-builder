/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const RuleDefinitionActionTypes = {
  ADD_RULE_DEFINITION: 'ADD_RULE_DEFINITION',
  REMOVE_RULE_DEFINITION: 'REMOVE_RULE_DEFINITION',
};

export type RuleDefinitionActionType = $Values<
  typeof RuleDefinitionActionTypes
>;

export default RuleDefinitionActionTypes;
