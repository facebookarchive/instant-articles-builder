/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron');
  const resolveCSSSelector = require('./utils/resolve-css-selector');

  ipcRenderer.on('message', (event, message) => receiveMessage(message));

  function getAttributes(element) {
    let attributes = [...element.attributes]
      .filter(attr => !['class', 'id', 'style'].includes(attr.name))
      .map(attr => ({
        name: attr.name,
        value: attr.value,
        type:
          attr.name == 'datetime'
            ? 'date' // RulePropertyTypes.DATETIME
            : attr.name == 'width' || attr.name == 'height'
              ? 'int' // RulePropertyTypes.INTEGER'
              : 'string', // RulePropertyTypes.STRING
      }));

    attributes.push({
      name: 'content',
      value: element.textContent,
      type: 'element', // RulePropertyTypes.ELEMENT,
    });

    attributes.push({
      name: 'textContent',
      value: element.textContent,
      type: 'string', //RulePropertyTypes.STRING,
    });

    return attributes;
  }

  let previousHoveredElement;
  let selectingElement = false;
  let selectingMultipleElements = false;
  let selectedElementSubscriberWindow;

  document.addEventListener('mouseover', handleMouseOver, false);
  document.addEventListener('click', handleClick, false);

  function receiveMessage(event) {
    if (event.method == 'highlightElements') {
      document.body.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-highlight-mode'
      );
      let elements = highlightElements(
        event.selector,
        event.source,
        !!event.multiple
      );
    } else if (event.method == 'selectElement') {
      selectingElement = true;
      selectingMultipleElements = !!event.multiple;
      document.body.classList.add(
        'facebook-instant-articles-sdk-rules-editor-highlight-mode'
      );
      clearHighlightedElements();
    } else if (event.method == 'clear') {
      selectingElement = false;
      selectingMultipleElements = false;
      document.body.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-highlight-mode'
      );
      clearHighlightedElements();
    }
  }

  function highlightElements(selector, multiple) {
    selectingElement = false;
    selectingMultipleElements = false;
    clearHighlightedElements();

    // Add class to the new highlighted elements
    let elements = document.querySelectorAll(selector);
    var className = 'facebook-instant-articles-sdk-rules-editor-highlight';

    if (!multiple) {
      className =
        elements.length > 1
          ? 'facebook-instant-articles-sdk-rules-editor-highlight-multiple'
          : 'facebook-instant-articles-sdk-rules-editor-highlight-single';
    }

    elements.forEach(function(element) {
      element.classList.add(className);
    });

    if (elements.length > 0) {
      ipcRenderer.sendToHost('message', {
        message: 'attributes',
        value: {
          selector: selector,
          count: elements.length,
          attributes: getAttributes(elements.item(0)),
        },
      });
    }
  }

  function clearHighlightedElements() {
    // Remove class form existing highlighted elements
    var oldHighlightedElements = document.querySelectorAll(
      '.facebook-instant-articles-sdk-rules-editor-highlight-multiple'
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-highlight-multiple'
      );
    });

    oldHighlightedElements = document.querySelectorAll(
      '.facebook-instant-articles-sdk-rules-editor-highlight-single'
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-highlight-single'
      );
    });

    oldHighlightedElements = document.querySelectorAll(
      '.facebook-instant-articles-sdk-rules-editor-hover'
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-hover'
      );
    });

    oldHighlightedElements = document.querySelectorAll(
      '.facebook-instant-articles-sdk-rules-editor-hover-parent'
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-hover-parent'
      );
    });

    oldHighlightedElements = document.querySelectorAll(
      '.facebook-instant-articles-sdk-rules-editor-highlight'
    );
    oldHighlightedElements.forEach(function(element) {
      element.classList.remove(
        'facebook-instant-articles-sdk-rules-editor-highlight'
      );
    });
  }

  function handleMouseOver(event) {
    if (
      !selectingElement ||
      event.target === document.body ||
      (previousHoveredElement && previousHoveredElement === event.target)
    ) {
      return;
    }

    clearHighlightedElements();
    let className = 'facebook-instant-articles-sdk-rules-editor-hover';
    event.target.classList.add(className);

    let parent = event.target.parentNode;
    let parentClassName =
      'facebook-instant-articles-sdk-rules-editor-hover-parent';
    while (parent && parent.classList) {
      parent.classList.add(parentClassName);
      parent = parent.parentNode;
    }
  }

  function handleClick(event) {
    if (!selectingElement) {
      return;
    }

    document.body.classList.remove(
      'facebook-instant-articles-sdk-rules-editor-highlight-mode'
    );
    // Resolve the CSS selector for the selected element
    let resolvedCssSelector = resolveCSSSelector(
      event.target,
      selectingMultipleElements
    );
    // Notify the Browser component that we resolved a CSS selector from a DOM element
    ipcRenderer.sendToHost('message', {
      message: 'DOM',
      value: {
        resolvedCssSelector: resolvedCssSelector,
      },
    });

    highlightElements(resolvedCssSelector, selectingMultipleElements);

    selectingElement = false;
    selectingMultipleElements = false;

    // Prevent navigation to links when clicked
    event.preventDefault();
  }
});
