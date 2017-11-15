/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const RULE_CLASS_NAME_SUFFIX = 'Rule';

/*
* Converts a class name to a readable display name.
* 1- Removes Rule suffix, if present
* 2- Splits Pascal or Camel casing to words separated by spaces
*/
function getInputRuleDisplayName(inputRule) {
  if (inputRule.displayName) {
    return inputRule.displayName;
  }

  let ruleClassName = inputRule.class;

  if (ruleClassName.endsWith(RULE_CLASS_NAME_SUFFIX)) {
    ruleClassName = ruleClassName.substr(
      0,
      ruleClassName.length - RULE_CLASS_NAME_SUFFIX.length
    );
  }

  return splitCamelOrPascalCasedString(ruleClassName);
}

function splitCamelOrPascalCasedString(jointWords) {
  return jointWords
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

module.exports = { getInputRuleDisplayName: getInputRuleDisplayName };
