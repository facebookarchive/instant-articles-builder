/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
const LabelIcon = require('./LabelIcon.react.js');
import type { BaseProps as Props } from './LabelIcon.react.js';

const LabelIconRequired = ({ children, position }: Props) => (
  <LabelIcon icon="✘" tooltip="Field is required" position={position}>
    {children}
  </LabelIcon>
);

module.exports = LabelIconRequired;
