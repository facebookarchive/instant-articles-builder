/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export const WebviewStates = {
  DEFAULT: 'default',
  SELECTING_ELEMENT: 'selecting_element',
  SELECTING_MULTIPLE: 'selecting_multiple',
};

export type WebviewState = $Values<typeof WebviewStates>;

export type WebviewStateChangeListener = (
  oldState: WebviewState,
  newState: WebviewState
) => void;

let state: WebviewState = WebviewStates.DEFAULT;
let contextSelector: string = 'html';
let passThroughSelectors: string[] = [];
let fieldName: ?string = null;
let listeners: WebviewStateChangeListener[] = [];

export class WebviewStateMachine {
  static onChange(listener: WebviewStateChangeListener) {
    listeners.push(listener);
  }

  static set contextSelector(newContextSelector: string) {
    contextSelector = newContextSelector;
  }

  static get contextSelector(): string {
    return contextSelector;
  }

  static set fieldName(newFieldName: string) {
    fieldName = newFieldName;
  }

  static get fieldName(): ?string {
    return fieldName;
  }

  static set passThroughSelectors(newPassThroughSelectors: string[]) {
    passThroughSelectors = newPassThroughSelectors;
  }

  static get passThroughSelectors(): string[] {
    return passThroughSelectors;
  }

  static set state(newState: WebviewState) {
    if (newState == state) {
      return;
    }
    let oldState = state;
    state = newState;
    listeners.forEach(listener => listener(oldState, newState));
  }

  static get state(): WebviewState {
    return state;
  }
}
