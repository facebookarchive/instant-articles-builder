/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AttributeRecord } from './Attribute';

/**
 * BrowserMessageType
 */
export const BrowserMessageTypes = {
  FETCH_ATTRIBUTES: 'fetch_attributes',
  SELECT_ELEMENT: 'select_element',
  ATTRIBUTES_RETRIEVED: 'attributes_retrieved',
  ELEMENT_SELECTED: 'element_selected',
  HIGHLIGHT_ELEMENT: 'highlight_element',
  HIGHLIGHT_WARNING_ELEMENTS: 'highlight_warning_elements',
  CLEAR_HIGHLIGHTS: 'clear_highlights',
};

export type BrowserMessageType = $Values<typeof BrowserMessageTypes>;

/**
 * FetchAttributesMessage
 */
export type FetchAttributesMessage = {
  type: 'fetch_attributes',
  selector: string,
  contextSelector: string,
};

/**
 * SelectElementMessage
 */
export type SelectElementMessage = {
  type: 'select_element',
  multiple: boolean,
  selector: string,
  passThroughSelectors: string[],
  fieldName: string,
};

/**
 * AttributesRetrievedMessage
 */
export type AttributesRetrievedMessage = {
  type: 'attributes_retrieved',
  selector: string,
  attributes: AttributeRecord[],
  count: number,
};

/**
 * ElementSelectedMessage
 */
export type ElementSelectedMessage = {
  type: 'element_selected',
  selectors: string[],
};

/**
 * HighlightElementMessage
 */
export type HighlightElementMessage = {
  type: 'highlight_element',
  selector: string,
  contextSelector: string,
};

/**
 * HighlightWarningElementsMessage
 */
export type HighlightWarningElementsMessage = {
  type: 'highlight_warning_elements',
  selector: string,
  contextSelector: string,
};

/**
 * ClearHighlightsMessage
 */
export type ClearHighlightsMessage = {
  type: 'clear_highlights',
};

/**
 * BrowserMessage
 */
export type BrowserMessage =
  | FetchAttributesMessage
  | SelectElementMessage
  | AttributesRetrievedMessage
  | ElementSelectedMessage
  | HighlightElementMessage
  | HighlightWarningElementsMessage
  | ClearHighlightsMessage;
