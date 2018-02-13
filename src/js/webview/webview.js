/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { CSSSelectorResolver } from './CSSSelectorResolver';
import { ipcRenderer } from 'electron';
import { BrowserMessageTypes } from '../models/BrowserMessage';
import { WebviewStateMachine, WebviewStates } from './WebviewStateMachine';
import { WebviewUtils } from './WebviewUtils';
import type { WebviewState } from './WebviewStateMachine';
import type { BrowserMessage } from '../models/BrowserMessage';

// Load Filters
import './filters/all.selector.filter';
import './filters/GlobalRule.article.body.filter';
import './filters/GlobalRule.author.name.filter';

//
// Listen to messages from the Browser
//
ipcRenderer.on('message', (event, message) => receiveMessage(message));

function receiveMessage(message: BrowserMessage): void {
  if (document.body == null) {
    return;
  }
  switch (message.type) {
    case BrowserMessageTypes.HIGHLIGHT_ELEMENT:
      WebviewStateMachine.state = WebviewStates.DEFAULT;
      WebviewUtils.highlightElementsBySelector(
        message.selector,
        message.contextSelector
      );
      break;

    case BrowserMessageTypes.SELECT_ELEMENT:
      WebviewUtils.clearHighlights();
      WebviewStateMachine.contextSelector = message.selector;
      WebviewStateMachine.passThroughSelectors = message.passThroughSelectors;
      WebviewStateMachine.fieldName = message.fieldName;
      if (message.multiple) {
        WebviewStateMachine.state = WebviewStates.SELECTING_MULTIPLE;
      } else {
        WebviewStateMachine.state = WebviewStates.SELECTING_ELEMENT;
      }
      break;

    case BrowserMessageTypes.CLEAR_HIGHLIGHTS:
      WebviewStateMachine.state = WebviewStates.DEFAULT;
      WebviewUtils.clearHighlights();
      break;

    case BrowserMessageTypes.FETCH_ATTRIBUTES:
      fetchAttributes(message.selector, message.contextSelector);
      break;
  }
}

function fetchAttributes(selector: string, contextSelector: string) {
  if (selector == '') {
    return;
  }
  const contextElements = document.querySelectorAll(contextSelector);
  for (let context of contextElements) {
    const elements = context.querySelectorAll(selector);
    const count = elements.length;

    let attributes = null;
    if (context.matches(selector)) {
      // Handle selecting the context itself, not a child node
      // Ex: selecting a/href as the href of a link
      attributes = WebviewUtils.getAttributes(context);
    } else if (count > 0) {
      // Returns the attributes of the first matched element
      attributes = WebviewUtils.getAttributes(elements.item(0));
    }

    if (attributes != null) {
      ipcRenderer.sendToHost('message', {
        type: BrowserMessageTypes.ATTRIBUTES_RETRIEVED,
        selector,
        count,
        attributes,
      });
      return;
    }
  }
}

//
// Listen to changes in the webview state
//
WebviewStateMachine.onChange(onChangeState);

function onChangeState(oldState: WebviewState, newState: WebviewState) {
  const body = document.body;
  if (body == null) {
    return;
  }

  switch (newState) {
    case WebviewStates.SELECTING_ELEMENT:
    case WebviewStates.SELECTING_MULTIPLE:
      WebviewUtils.startSelecting(WebviewStateMachine.contextSelector);
      document.addEventListener('click', handleSelectElement);
      document.addEventListener('mouseover', hightlightOnHover);
      break;

    case WebviewStates.DEFAULT:
      WebviewUtils.stopSelecting();
      document.removeEventListener('click', handleSelectElement);
      document.removeEventListener('mouseover', hightlightOnHover);
      break;
  }
}

function handleSelectElement(event: MouseEvent) {
  let element = event.target;
  if (!(element instanceof Element)) {
    return;
  }

  const fieldName = WebviewStateMachine.fieldName;
  if (fieldName == null) {
    return;
  }

  const contextSelector = WebviewStateMachine.contextSelector;

  // Filter element
  element = WebviewUtils.filterElement(element);

  // Resolve the CSS selector for the selected element
  const selectors: string[] = CSSSelectorResolver.resolve(
    element,
    WebviewStateMachine.state === WebviewStates.SELECTING_MULTIPLE,
    contextSelector,
    fieldName
  );

  ipcRenderer.sendToHost('message', {
    type: BrowserMessageTypes.ELEMENT_SELECTED,
    selectors,
  });

  const selector = selectors[0];
  if (selector != null) {
    WebviewUtils.highlightElementsBySelector(
      selector,
      WebviewStateMachine.contextSelector
    );
  }

  WebviewStateMachine.state = WebviewStates.DEFAULT;

  // Prevent navigation to links when clicked
  event.preventDefault();
}

function hightlightOnHover(event: MouseEvent) {
  WebviewUtils.clearHighlights();
  let element = event.target;
  if (element instanceof Element) {
    WebviewUtils.hoverElement(WebviewUtils.filterElement(element));
  }
}
