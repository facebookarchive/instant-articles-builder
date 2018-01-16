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

import RuleActions from '../data/RuleActions';
import EditorActions from '../data/EditorActions';
import type { Rule } from '../models/Rule';
import { RuleFactory } from '../models/Rule';
import { RulePropertyFactory } from '../models/RuleProperty';
import type { RuleProperty } from '../models/RuleProperty';
import type { Props as BaseProps } from '../containers/AppContainer.react';
import type { Field } from '../models/Field';

type Props = BaseProps & { field: Field };

type State = {
  findButtonCenterX: number,
  findButtonCenterY: number,
  findLineLocationAttributes: Object,
  findSvgStyle: Object
};

class SelectorPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  configureLine(): void {
    const clientRect = this.refs.targetButton.getBoundingClientRect();
    this.setState({
      findButtonCenterX: clientRect.left + clientRect.width / 2,
      findButtonCenterY: clientRect.top + clientRect.height / 2,
    });
  }

  isFinding(): boolean {
    return (
      this.props.editor.focusedField == this.props.field &&
      this.props.editor.finding
    );
  }

  enableMouseMoveTracking() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  disableMouseMoveTracking() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  componentDidMount() {
    this.enableMouseMoveTracking();
    this.configureLine();
  }

  componentWillUnmount() {
    this.disableMouseMoveTracking();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.editor.focusedField != this.props.field &&
      prevProps.editor.focusedField == this.props.field
    ) {
      this.refs.selectorInput.blur();
    }
  }

  handleMouseMove = (event: MouseEvent) => {
    if (this.isFinding()) {
      this.configureLine();
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
      RuleActions.editField(this.props.field.set('selector', selector));
    }
  };

  handleFocus = (event: Event) => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      EditorActions.focusField(this.props.field);
    }
  };

  handleFindButtonClick = (event: Event) => {
    EditorActions.startFinding(this.props.field);
    event.preventDefault();
  };

  render() {
    let warning = null;
    let count = this.props.editor.elementCounts.get(this.props.field.selector);

    if (count != null && count > 1) {
      warning = this.props.field.definition.unique ? (
        <div className="warning">
          Warning: the current selector matched {count} elements, but only the
          first one will be used.
        </div>
      ) : (
        <div className="notice">
          The current selector matched {count} elements.
        </div>
      );
    }

    const findLine = this.isFinding() ? (
      <svg className="line" style={this.state.findSvgStyle}>
        <line {...this.state.findLineLocationAttributes} />
      </svg>
    ) : null;

    return (
      <div>
        <div className="selector-picker">
          <input
            type="text"
            name={this.props.field.definition.name}
            placeholder={this.props.field.definition.placeholder}
            value={this.props.field.selector}
            onChange={this.handleSelectorChanged}
            onFocus={this.handleFocus}
            ref="selectorInput"
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
        {warning}
      </div>
    );
  }
}

module.exports = SelectorPicker;
