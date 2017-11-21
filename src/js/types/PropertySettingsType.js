/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { AttributeType } from './AttributeType';

export type PropertySettingsType = {
  attributes: Array<AttributeType>,
  count?: ?number,
  dateTimeFormat?: string,
  defaultAttribute: string,
  label: string,
  multiple?: boolean,
  name: string,
  placeholder: string,
  selectedAttribute?: AttributeType,
  selector?: ?string,
  type?: string
};
