/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import resolveCSSSelector from '../utils/resolve-css-selector';
import { ipcRenderer } from 'electron';
import { BrowserMessageTypes } from '../models/BrowserMessage';
import { WebviewStateMachine, WebviewStates } from './WebviewStateMachine';
import { WebviewUtils } from './WebviewUtils';
import type { WebviewState } from './WebviewStateMachine';
import type { BrowserMessage } from '../models/BrowserMessage';

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
      WebviewUtils.highlightElementsBySelector(message.selector);
      break;

    case BrowserMessageTypes.SELECT_ELEMENT:
      WebviewUtils.clearHighlights();
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
      fetchAttributes(message.selector);
      break;
  }
}

function fetchAttributes(selector: string) {
  if (selector == '') {
    return;
  }
  const elements = document.querySelectorAll(selector);
  const count = elements.length;
  const attributes = WebviewUtils.getAttributes(elements.item(0));

  ipcRenderer.sendToHost('message', {
    type: BrowserMessageTypes.ATTRIBUTES_RETRIEVED,
    selector,
    count,
    attributes,
  });
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
      document.addEventListener('click', handleSelectElement);
      document.addEventListener('mouseover', hightlightOnHover);
      break;

    case WebviewStates.DEFAULT:
      document.removeEventListener('click', handleSelectElement);
      document.removeEventListener('mouseover', hightlightOnHover);
      break;
  }
}

function handleSelectElement(event: MouseEvent) {
  // Resolve the CSS selector for the selected element
  let selectors: string[] = resolveCSSSelector(
    event.target,
    WebviewStateMachine.state === WebviewStates.SELECTING_MULTIPLE
  );

  ipcRenderer.sendToHost('message', {
    type: BrowserMessageTypes.ELEMENT_SELECTED,
    selectors,
  });

  const selector = selectors[0];
  if (selector != null) {
    WebviewUtils.highlightElementsBySelector(selector);
  }

  WebviewStateMachine.state = WebviewStates.DEFAULT;

  // Prevent navigation to links when clicked
  event.preventDefault();
}

function hightlightOnHover(event: MouseEvent) {
  WebviewUtils.clearHighlights();
  let target = event.target;
  if (target instanceof Element) {
    WebviewUtils.hoverElement(target);
  }
}
