/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { State as RuleStoreState } from '../data/RuleStore';
import type { RuleCategory } from '../models/RuleCategories';
import { RuleUtils } from '../models/Rule';
import type { Field } from '../models/Field';

/**
 * Context selector function that returns always 'html'
 *
 * @returns The 'html' string literal
 */
export function htmlSelectionContext(
  field: Field,
  rules: RuleStoreState
): string {
  return 'html';
}

/**
 * Context selector function that retrieves the article.body selectors
 * of the GlobalRule if present.
 *
 * @returns The selector of article.body on GlobalRule or 'html' if missing
 */
export function articleBodySelectionContext(
  field: Field,
  rules: RuleStoreState
): string {
  for (let rule of rules.valueSeq()) {
    if (rule.definition.name === 'GlobalRule' && RuleUtils.isValid(rule)) {
      const selector = rule.properties.getIn(['article.body', 'selector']);
      if (selector != null && selector != '') {
        return selector;
      }
    }
  }
  return 'html';
}

/**
 * Context selector function that retrieves the selector of the owner
 * rule of the current RuleProperty.
 *
 * @returns The selector of the owning rule or 'html' if not a RuleProperty
 */
export function ruleSelectionContext(
  field: Field,
  rules: RuleStoreState
): string {
  // Calculate context for selecting elements
  if (field.fieldType === 'RuleProperty' && field.rule != null) {
    let ruleGuid = field.rule.guid;
    for (let rule of rules.valueSeq()) {
      if (rule.guid === ruleGuid) {
        return rule.selector;
      }
    }
  }
  return 'html';
}

/**
 * @returns a context selection function that returns the combined selectors
 * of all given rule categories and 'html' if the output list ends up empty.
 */
export function selectionContextByRuleCategories(
  ruleCategories: RuleCategory[]
): (field: Field, rules: RuleStoreState) => string {
  return (field: Field, rules: RuleStoreState): string => {
    const selectors: string[] = [];
    for (let rule of rules.valueSeq()) {
      if (
        ruleCategories.includes(rule.definition.category) &&
        RuleUtils.isValid(rule)
      ) {
        selectors.push(rule.selector);
      }
    }
    if (selectors.length > 0) {
      return selectors.join(', ');
    }
    return 'html';
  };
}

/**
 * @returns a context selection function that returns the combined selectors
 * of all given rule names and 'html' if the output list ends up empty.
 */
export function selectionContextByRules(
  ruleNames: string[]
): (field: Field, rules: RuleStoreState) => string {
  return (field: Field, rules: RuleStoreState): string => {
    const selectors: string[] = [];
    for (let rule of rules.valueSeq()) {
      if (ruleNames.includes(rule.definition.name) && RuleUtils.isValid(rule)) {
        selectors.push(rule.selector);
      }
    }
    if (selectors.length > 0) {
      return selectors.join(', ');
    }
    return 'html';
  };
}
