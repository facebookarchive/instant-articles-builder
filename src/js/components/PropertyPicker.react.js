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
const classNames = require('classnames');
const DateTimeFormatPicker = require('./DateTimeFormatPicker.react.js');
const SelectorPicker = require('./SelectorPicker.react.js');

const DATE_TIME_TYPE = 'DateTime';

import type { AttributeType } from '../types/AttributeType';
import type { SelectorChangedArgsType } from '../types/SelectorChangedArgsType';
import type { SelectorFindArgsType } from '../types/SelectorFindArgsType';

type AttributeChangedArgsType = {
  attribute: AttributeType,
  propertyName: string,
  propertySelector: string
};

type DateTimeFormatChangedArgs = {
  format: string,
  propertyName: string
};

type PropsType = {
  active: boolean,
  attributes: Array<AttributeType>,
  className: string,
  count: number,
  dateTimeFormat: string,
  defaultAttribute: string,
  finding: boolean,
  label: string,
  multiple: boolean,
  name: string,
  onAttributeChanged: AttributeChangedArgsType => void,
  onDateTimeFormatChanged: DateTimeFormatChangedArgs => void,
  onFind: SelectorFindArgsType => void,
  onFocus: SelectorChangedArgsType => void,
  onSelectorChanged: SelectorChangedArgsType => void,
  placeholder: string,
  selector: string,
  selectedAttribute: AttributeType
};

class PropertyPicker extends React.Component<PropsType> {
  handleSelectedAttributeChanged = (event: Event) => {
    const selectElement = ((event.target: any): HTMLSelectElement);
    const selectedOptionElement =
      selectElement.children[selectElement.selectedIndex];
    this.props.onAttributeChanged({
      propertyName: this.props.name,
      propertySelector: this.props.selector,
      attribute: {
        name: selectElement.value,
        value: selectedOptionElement.getAttribute('data-attribute-value') || '',
      },
    });
  };

  handleDateTimeFormatChanged = (format: string) => {
    if (this.props.onDateTimeFormatChanged) {
      this.props.onDateTimeFormatChanged({
        propertyName: this.props.name,
        format: format,
      });
    }
  };

  componentWillReceiveProps(nextProps: PropsType) {
    let defaultAttribute = this.props.defaultAttribute;
    if (nextProps.attributes.length > 0 && this.props.attributes.length === 0) {
      this.props.onAttributeChanged({
        propertyName: this.props.name,
        propertySelector: this.props.selector,
        attribute:
          this.props.defaultAttribute &&
          nextProps.attributes.filter(a => a.name === defaultAttribute).length >
            0
            ? nextProps.attributes.filter(a => a.name === defaultAttribute)[0]
            : nextProps.attributes[0],
      });
    }
  }

  render() {
    let classes = classNames(this.props.className, {
      'field-line': true,
      active: !!this.props.active,
      finding: !!this.props.finding,
      'single-element-found': this.props.count === 1,
      'multiple-elements-found': this.props.count > 1,
      multiple: this.props.multiple,
    });

    let warning = null;

    if (this.props.count > 1) {
      warning = this.props.multiple ? (
        <div className="notice">
          The current selector matches {this.props.count} elements.
        </div>
      ) : (
        <div className="warning">
          Warning: the current selector matches {this.props.count} elements, but
          only the first one will be used.
        </div>
      );
    }

    const dateTimeFormatPicker =
      this.props.type === DATE_TIME_TYPE ? (
        <DateTimeFormatPicker
          name={this.props.name + '-format'}
          expectedDateTime={
            this.props.selectedAttribute
              ? this.props.selectedAttribute.value
              : null
          }
          format={this.props.dateTimeFormat}
          onFormatChanged={this.handleDateTimeFormatChanged}
        />
      ) : null;

    return (
      <div className={classes}>
        <label htmlFor={this.props.name}>
          {this.props.label}
          <span />
        </label>
        <label htmlFor={this.props.name} className="sub-label">
          Selector
        </label>
        <SelectorPicker
          name={this.props.name}
          placeholder={this.props.placeholder}
          selector={this.props.selector}
          multiple={this.props.multiple}
          finding={this.props.finding}
          onSelectorChanged={this.props.onSelectorChanged}
          onFocus={this.props.onFocus}
          onFind={this.props.onFind}
        />

        {warning}

        <div
          className="attributes"
          style={this.props.attributes.length == 0 ? { display: 'none' } : {}}
        >
          <label htmlFor={this.props.name} className="sub-label">
            Attribute
          </label>
          <select onChange={this.handleSelectedAttributeChanged}>
            {this.props.attributes &&
              this.props.attributes.map(attribute => (
                <option
                  value={attribute.name}
                  data-attribute-value={attribute.value}
                  key={attribute.name}
                  selected={
                    (!!this.props.selectedAttribute &&
                      attribute.name == this.props.selectedAttribute.name) ||
                    attribute.name == this.props.defaultAttribute
                      ? 'selected'
                      : ''
                  }
                >
                  {attribute.name}: "{attribute.value.trim()}"
                </option>
              ))}
          </select>
          {dateTimeFormatPicker}
        </div>
      </div>
    );
  }
}

module.exports = PropertyPicker;
