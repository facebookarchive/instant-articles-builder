/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { WebviewUtils } from '../WebviewUtils';
import { WebviewStateMachine } from '../WebviewStateMachine';

/**
 * Filters the selection of all Rule selectors to match the immediate child of
 * the selection context (usually the article.body).
 */
const filter = (element: Element): Element => {
  const contextSelector = WebviewStateMachine.contextSelector;
  let el = element;
  if (contextSelector == null) {
    return element;
  }
  while (el && el.parentElement != null) {
    if (el && el.parentElement.matches(contextSelector)) {
      return el;
    }
    el = el.parentElement;
  }
  return element;
};

WebviewUtils.addElementFilter(filter, 'all.selector');
