/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import RulePropertyTypes from '../models/RulePropertyTypes';
import type { AttributeRecord } from '../models/Attribute';

const highlightClass = 'facebook-instant-articles-sdk-rules-editor-highlight';
const hoverClass = 'facebook-instant-articles-sdk-rules-editor-hover';

export class WebviewUtils {
  static clearHighlights(): void {
    // Remove class form existing highlighted elements
    let oldHighlightedElements = document.querySelectorAll(
      `.${highlightClass}, .${hoverClass}`
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(highlightClass);
      element.classList.remove(hoverClass);
    });
  }

  static highlightElementsBySelector(selector: string): void {
    WebviewUtils.clearHighlights();
    if (selector == '') {
      return;
    }
    // Add class to the new highlighted elements
    let elements = document.querySelectorAll(selector);
    var className = highlightClass;
    elements.forEach(function(element) {
      element.classList.add(className);
    });
  }

  static hoverElement(element: Element): void {
    element.classList.add(hoverClass);
  }

  /**
   * Given an element, returns a list of possible attributes.
   *
   * @param {Element} element
   * @returns {Attribute[]} the attribute list
   */
  static getAttributes(element: Element): AttributeRecord[] {
    let attributes = [...element.attributes]
      .filter(attr => !['class', 'id', 'style'].includes(attr.name))
      .map(attr => ({
        name: attr.name,
        value: attr.value,
        type:
          attr.name == 'datetime'
            ? RulePropertyTypes.DATETIME
            : attr.name == 'width' || attr.name == 'height'
              ? RulePropertyTypes.INTEGER
              : RulePropertyTypes.STRING,
      }));

    attributes.push({
      name: 'innerContent',
      value: element.textContent,
      type: RulePropertyTypes.ELEMENT,
    });

    attributes.push({
      name: 'textContent',
      value: element.textContent,
      type: RulePropertyTypes.STRING,
    });

    return attributes;
  }
}
