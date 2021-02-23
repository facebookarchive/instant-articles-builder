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
const LabelIconOptional = require('./common/LabelIcon/LabelIconOptional.react.js');
const LabelIconRequired = require('./common/LabelIcon/LabelIconRequired.react.js');
const LabelIconValid = require('./common/LabelIcon/LabelIconValid.react.js');
import type { RuleProperty } from '../models/RuleProperty';
import RulePropertyTypes from '../models/RulePropertyTypes';
import RuleActions from '../data/RuleActions';
import { RulePropertyUtils } from '../utils/RulePropertyUtils';

import type { Props as BaseProps } from '../containers/AppContainer.react';

type Props = BaseProps & { property: RuleProperty };

class PropertyPicker extends React.Component<Props> {
  handleAttributeChange = (event: Event) => {
    const selectElement = event.target;
    if (selectElement instanceof HTMLSelectElement) {
      RuleActions.editField(
        this.props.property
          .set('attribute', selectElement.value)
          .update('type', type => {
            const attributes = this.props.editor.elementAttributes.get(
              this.props.property.selector
            );
            if (attributes == null) {
              return type;
            }
            const attribute = attributes.get(selectElement.value);
            if (attribute == null) {
              return type;
            }
            return attribute.type;
          })
      );
    }
  };

  render() {
    let property = this.props.property;
    let attributes = null;

    // Look for the attributes for the current selector on the global attribute store
    if (property.selector) {
      attributes = this.props.editor.elementAttributes.get(property.selector);
    }

    const dateTimeFormatPicker = property.definition.supportedTypes.includes(
      RulePropertyTypes.DATETIME
    ) ? (
        <DateTimeFormatPicker {...this.props} />
      ) : null;

    const attributePicker =
      attributes != null || property.attribute != null ? (
        <div className="attributes">
          <label className="sub-label">Attribute</label>
          <select
            value={property.attribute || property.definition.defaultAttribute}
            onChange={this.handleAttributeChange}
          >
            {property.attribute != null &&
            (attributes == null || !attributes.has(property.attribute)) ? (
                <option
                  value={property.attribute}
                  data-attribute-value={property.attribute}
                  key={property.attribute}
                >
                  {property.attribute}
                </option>
              ) : null}
            {attributes != null
              ? attributes
                .valueSeq()
                .filter(attribute =>
                  this.props.property.definition.supportedTypes.includes(
                    attribute.type
                  )
                )
                .map(attribute => (
                  <option
                    value={attribute.name}
                    data-attribute-value={attribute.value}
                    key={attribute.name}
                  >
                    {attribute.name}: "{attribute.value.trim()}"
                  </option>
                ))
              : null}
          </select>
          {dateTimeFormatPicker}
        </div>
      ) : null;

    const propertyClass =
      'property-' + this.props.property.definition.name.replace('.', '-');
    const labelDisplayName = this.props.property.definition.displayName;
    return (
      <div
        className={classNames({
          'field-line': true,
          'single-element-found':
            this.props.editor.elementCounts.get(this.props.property.selector) ==
            1,
          'multiple-elements-found':
            (this.props.editor.elementCounts.get(
              this.props.property.selector
            ) || 0) > 1,
          active: this.props.editor.focusedField == this.props.property,
          multiple: !this.props.property.definition.unique,
          required: this.props.property.definition.required,
          valid: RulePropertyUtils.isValid(this.props.property),
          [propertyClass]: true,
        })}
      >
        {RulePropertyUtils.isValid(this.props.property) ? (
          <LabelIconValid>{labelDisplayName}</LabelIconValid>
        ) : this.props.property.definition.required ? (
          <LabelIconRequired>{labelDisplayName}</LabelIconRequired>
        ) : (
          <LabelIconOptional>{labelDisplayName}</LabelIconOptional>
        )}{' '}
        <label className="sub-label selector-label">Selector</label>
        <SelectorPicker {...this.props} field={this.props.property} />
        {attributePicker}
      </div>
    );
  }
}

module.exports = PropertyPicker;
