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
import { WebviewStateMachine } from './WebviewStateMachine';

const highlightClass = 'facebook-instant-articles-sdk-rules-editor-highlight';
const hoverClass = 'facebook-instant-articles-sdk-rules-editor-hover';
const contextClass = 'facebook-instant-articles-sdk-rules-editor-context';
const selectingClass = 'facebook-instant-articles-sdk-rules-editor-selecting';

export type ElementFilter = (element: Element) => Element;
const elementFilters: Map<string, ElementFilter> = new Map();

export class WebviewUtils {
  static startSelecting(contextSelector: string): void {
    let body = document.body;
    if (body == null) {
      return;
    }
    if (contextSelector == '') {
      return;
    }
    body.classList.add(selectingClass);
    // Add class to the new highlighted elements
    let elements = document.querySelectorAll(contextSelector);
    elements.forEach(function(element) {
      element.classList.add(contextClass);
    });
  }

  static stopSelecting(): void {
    let body = document.body;
    if (body == null) {
      return;
    }

    body.classList.remove(selectingClass);

    let oldHighlightedElements = document.querySelectorAll(`.${contextClass}`);
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(contextClass);
    });
  }

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

  static highlightElementsBySelector(
    selector: string,
    contextSelector: string
  ): void {
    WebviewUtils.clearHighlights();
    if (selector == '') {
      return;
    }
    // Add class to the new highlighted elements
    let contextElements = document.querySelectorAll(contextSelector);
    for (let context of contextElements) {
      let elements = context.querySelectorAll(selector);
      elements.forEach(function(element) {
        element.classList.add(highlightClass);
      });
    }
  }

  /**
   * Register an ElementFilter for the given fieldName being selected.
   *
   * The format of the fieldName is:
   * - RuleName.propertyName for matching a single property
   * - RuleName.selector for matching the selector field of the Rule
   * - *.propertyName for matching propertyName on any Rule
   * - *.selector for matching the selector of any Rule
   *
   * @param {string} fieldName The name of the field
   */
  static addElementFilter(elementFilter: ElementFilter, fieldName: string) {
    elementFilters.set(fieldName, elementFilter);
  }

  /**
   * Filters the elements through registered filters.
   */
  static filterElement(element: Element): Element {
    let field = WebviewStateMachine.fieldName;
    if (field != null) {
      // Try get the filter by key
      let filter = elementFilters.get(field);
      if (filter == null) {
        // Try wildcard match the filters like all.propertyName
        filter = elementFilters.get(field.replace(/^[a-z]*\./i, 'all.'));
      }
      if (filter != null) {
        return filter(element);
      }
    }
    return element;
  }

  static hoverElement(element: Element): void {
    WebviewUtils.clearHighlights();
    element.classList.add(hoverClass);
  }

  /**
   * Given an element, returns a list of possible attributes.
   *
   * @param {Element} element
   * @returns {Attribute[]} the attribute list
   */
  static getAttributes(element: Element): AttributeRecord[] {
    if (element == null) {
      return [];
    }
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

    attributes.push({
      name: 'dateTextContent',
      value: element.textContent,
      type: RulePropertyTypes.DATETIME,
    });

    return attributes;
  }
}
