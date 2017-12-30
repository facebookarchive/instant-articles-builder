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
const PropertyPicker = require('./PropertyPicker.react.js');
const SelectorPicker = require('./SelectorPicker.react');
const classNames = require('classnames');
const RuleActions = require('../data/RuleActions');

import type { Rule } from '../models/Rule';
import type { Props as BaseProps } from '../containers/AppContainer.react';

type Props = BaseProps & { rule: Rule };

type State = {
  collapsed: boolean
};

class RulePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  handleRemove = (event: Event) => {
    event.preventDefault();
    RuleActions.removeRule(this.props.rule);
  };

  handleToggle = () => {
    this.setState((prevState, props) => ({
      collapsed: !prevState.collapsed,
    }));
  };

  render() {
    const toggler = this.state.collapsed
      ? '\u25B6' // right triangle
      : '\u25BC'; // down triangle

    return (
      <form
        className={classNames({
          'selectors-form': true,
          collapsed: !!this.state.collapsed,
        })}
      >
        <h2 className="rule-header" onClick={this.handleToggle}>
          {toggler} {this.props.rule.definition.displayName}
        </h2>

        <button className="btn-close" onClick={this.handleRemove}>
          &#10006;
        </button>

        <div className="rule-settings">
          <SelectorPicker {...this.props} target={this.props.rule} />
          {(this.props.rule.properties || []).forEach(property => (
            <PropertyPicker {...this.props} property={property} />
          ))}
        </div>
      </form>
    );
  }
}

module.exports = RulePicker;
