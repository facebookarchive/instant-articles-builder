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

export type BaseProps = {
  children: string,
  position?: string,
};

type Props = BaseProps & {
  icon?: string,
  tooltip?: string,
};

const LabelIcon = ({
  children,
  icon,
  tooltip,
  position = 'bottom left',
}: Props) => (
  <label>
    <span data-tooltip={tooltip} data-position={position}>
      {icon}
    </span>
    {` ${children}`}
  </label>
);

module.exports = LabelIcon;
