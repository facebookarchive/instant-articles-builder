/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const React = require('react');

import type { Props as BaseProps } from '../containers/AppContainer.react';

type Props = BaseProps & { className: string, htmlFor: string };

class RuleLabel extends React.Component<Props> {
  render() {
    return (
      <div>
        <label
          className={this.props.className ? this.props.className : ''}
          htmlFor={this.props.htmlFor ? this.props.htmlFor : ''}
        >
          <span>
            {this.props.required ? '•' : this.props.filled ? '✘' : '✔'}
          </span>{' '}
          {this.props.title}
        </label>
      </div>
    );
  }
}

module.exports = RuleLabel;
