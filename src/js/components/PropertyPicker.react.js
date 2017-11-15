/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const classNames = require('classnames');
const DateTimeFormatPicker = require('./DateTimeFormatPicker.react.js');
const SelectorPicker = require('./SelectorPicker.react.js');

const DATE_TIME_TYPE = 'DateTime';

class PropertyPicker extends React.Component {
  handleSelectedAttributeChanged = event => {
    const selectElement = event.target;
    const selectedOptionElement = selectElement[selectElement.selectedIndex];
    this.props.onAttributeChanged({
      propertyName: this.props.name,
      propertySelector: this.props.selector,
      attribute: {
        name: selectElement.value,
        value: selectedOptionElement.getAttribute('data-attribute-value'),
      },
    });
  };

  handleDateTimeFormatChanged = format => {
    if (this.props.onDateTimeFormatChanged) {
      this.props.onDateTimeFormatChanged({
        propertyName: this.props.name,
        format: format,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
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
