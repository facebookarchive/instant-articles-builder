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

import EditorActions from '../data/EditorActions';

export type WarningProps = {
  message: ?string,
  selector: ?string,
  field: ?string,
};

type Props = {
  activeTab: number,
  warningSelector: ?string,
  warnings: WarningProps[],
};

type State = {
  activeWarning: ?number,
};

class Warnings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeWarning: null,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      JSON.stringify(nextProps.warnings) !==
        JSON.stringify(this.props.warnings) ||
      (nextProps.warningSelector === null &&
        nextProps.warningSelector !== this.props.warningSelector)
    ) {
      this.setState({ activeWarning: null });
    }
  }

  warningOnClick = (selector: ?string, index: ?number) => {
    if (!selector) {
      return;
    }
    if (index !== this.state.activeWarning) {
      EditorActions.blur();
      EditorActions.setWarningSelector(selector);
      this.setState({ activeWarning: index });
    } else {
      this.setState({ activeWarning: null });
      EditorActions.setWarningSelector(null);
    }
  };

  render() {
    return (
      <div className="warning-tab">
        {this.props.warnings.length > 0 ? (
          <ul>
            {this.props.warnings.map((warning, index) => (
              <li
                key={`warning-${index}`}
                onClick={
                  warning.selector
                    ? () => this.warningOnClick(warning.selector, index)
                    : () => {}
                }
                className={
                  warning.selector && warning.selector !== 'html'
                    ? `warning ${
                      this.state.activeWarning === index ? 'active' : ''
                    }`
                    : ''
                }
              >
                {warning.message}
              </li>
            ))}
          </ul>
        ) : (
          <div className="message-container">
            <p className="message">
              No warnings: All fields were successfully connected.
            </p>
          </div>
        )}
      </div>
    );
  }
}

module.exports = Warnings;
