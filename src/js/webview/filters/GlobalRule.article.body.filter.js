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

const contentTags = ['p', 'img'];

/**
 * Filters the selection of the body to be the parent of the
 * content that the mouse is over.
 */
const filter = (element: Element): Element => {
  if (contentTags.includes(element.tagName.toLowerCase())) {
    return element.parentElement || element;
  }
  return element;
};

WebviewUtils.addElementFilter(filter, 'GlobalRule.article.body');
