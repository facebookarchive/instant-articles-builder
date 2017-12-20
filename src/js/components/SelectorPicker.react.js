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

import type { SelectorChangedArgs } from '../types/SelectorChangedArgs';
import type { SelectorFindArgs } from '../types/SelectorFindArgs';

type Props = {
  finding: boolean,
  name: string,
  multiple: boolean,
  onBlur?: SelectorChangedArgs => void,
  onFind: SelectorFindArgs => void,
  onFocus?: SelectorChangedArgs => void,
  onSelectorChanged: SelectorChangedArgs => void,
  placeholder?: string,
  selector: string
};

type State = {
  findButtonCenterX: number,
  findButtonCenterY: number,
  findLineLocationAttributes: Object,
  findSvgStyle: Object
};

class SelectorPicker extends React.Component<Props, State> {
  handleMouseMove: Event => void;

  constructor(props: Props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  enableMouseMoveTracking() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  disableMouseMoveTracking() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    if (this.props.finding) {
      this.disableMouseMoveTracking();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.finding && !this.props.finding) {
      this.enableMouseMoveTracking();
    } else if (!nextProps.finding && this.props.finding) {
      this.disableMouseMoveTracking();
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.props.finding) {
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
  }

  handleSelectorChanged = (event: Event) => {
    if (this.props.onSelectorChanged) {
      const inputElement = event.target;
      if (inputElement instanceof HTMLInputElement) {
        const selector = inputElement.value;
        this.props.onSelectorChanged({
          selector: selector,
          name: this.props.name,
          multiple: this.props.multiple,
        });
      }
    }
  };

  handleFocus = (event: Event) => {
    if (this.props.onFocus) {
      const inputElement = event.target;
      if (inputElement instanceof HTMLInputElement) {
        const selector = inputElement.value;
        this.props.onFocus({
          selector: selector,
          name: this.props.name,
          multiple: this.props.multiple,
        });
      }
    }
  };

  handleBlur = (event: Event) => {
    if (this.props.onBlur) {
      const inputElement = event.target;
      if (inputElement instanceof HTMLInputElement) {
        const selector = inputElement.value;
        this.props.onBlur({
          selector: selector,
          name: this.props.name,
          multiple: this.props.multiple,
        });
      }
    }
  };

  handleFindButtonClick = (event: Event) => {
    const clientRect = this.refs.targetButton.getBoundingClientRect();
    this.setState({
      findButtonCenterX: clientRect.left + clientRect.width / 2,
      findButtonCenterY: clientRect.top + clientRect.height / 2,
    });
    if (this.props.onFind) {
      this.props.onFind({
        name: this.props.name,
        multiple: this.props.multiple,
      });
    }
    event.preventDefault();
  };

  render() {
    const findLine = this.props.finding ? (
      <svg className="line" style={this.state.findSvgStyle}>
        <line {...this.state.findLineLocationAttributes} />
      </svg>
    ) : null;

    return (
      <div>
        <input
          type="text"
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.selector}
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
