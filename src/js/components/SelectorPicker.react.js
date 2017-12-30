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
import type { Rule } from '../models/Rule';
import type { RuleProperty } from '../models/RuleProperty';

import type { Props as BaseProps } from '../containers/AppContainer.react';

type Props = BaseProps & { target: Rule | RuleProperty };

type State = {
  findButtonCenterX: number,
  findButtonCenterY: number,
  findLineLocationAttributes: Object,
  findSvgStyle: Object
};

class SelectorPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.configureLine();
    this.enableMouseMoveTracking();
  }

  configureLine(): void {
    const clientRect = this.refs.targetButton.getBoundingClientRect();
    this.setState({
      findButtonCenterX: clientRect.left + clientRect.width / 2,
      findButtonCenterY: clientRect.top + clientRect.height / 2,
    });
  }

  isFinding(): boolean {
    if (this.props.app.finding == this.props.target) {
      return true;
    }
    return false;
  }

  enableMouseMoveTracking() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  disableMouseMoveTracking() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    this.disableMouseMoveTracking();
  }

  handleMouseMove = (event: MouseEvent) => {
    if (this.isFinding()) {
      const findSvgStyle = {
        top: Math.min(event.pageY, this.state.findButtonCenterY),
        left: Math.min(event.pageX, this.state.findButtonCenterX),
        width: Math.abs(event.pageX - this.state.findButtonCenterX),
        height: Math.abs(event.pageY - this.state.findButtonCenterY),
      };

      const findLineLocationAttributes = {
        x1: this.state.findButtonCenterX <= event.pageX ? 0 : '100%',
        y1: this.state.findButtonCenterY <= event.pageY ? 0 : '100%',
        x2: this.state.findButtonCenterX <= event.pageX ? '100%' : 0,
        y2: this.state.findButtonCenterY <= event.pageY ? '100%' : 0,
      };

      this.setState({
        findSvgStyle,
        findLineLocationAttributes,
      });
    }
  };

  handleSelectorChanged = (event: Event) => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const selector = inputElement.value;
    }
  };

  handleFocus = (event: Event) => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const selector = inputElement.value;
    }
  };

  handleBlur = (event: Event) => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const selector = inputElement.value;
    }
  };

  handleFindButtonClick = (event: Event) => {
    event.preventDefault();
  };

  render() {
    const findLine = this.isFinding() ? (
      <svg className="line" style={this.state.findSvgStyle}>
        <line {...this.state.findLineLocationAttributes} />
      </svg>
    ) : null;

    return (
      <div>
        <input
          type="text"
          placeholder={this.props.target.definition.placeholder}
          value={this.props.target.selector}
          onChange={this.handleSelectorChanged}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <button
          ref="targetButton"
          className="find-button"
          onClick={this.handleFindButtonClick}
        >
          Find
        </button>
        {findLine}
      </div>
    );
  }
}

module.exports = SelectorPicker;
