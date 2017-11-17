/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropertyPicker = require('./PropertyPicker.react.js');
const SelectorPicker = require('./SelectorPicker.react.js');
const FindSelectorTypes = require('../find-selector-types.js');
const update = require('immutability-helper');
const classNames = require('classnames');

class RulePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  handleRuleChanged = event => {
    this.props.onRuleChanged({
      ruleKey: this.props.ruleKey,
      selectedInputRuleIndex: event.target.value,
    });
  };

  handleSelectorChanged = event => {
    this.props.onSelectorChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleRuleSelectorPickerFind = event => {
    this.handleFind(FindSelectorTypes.RULE, event);
  };

  handlePropertyPickerSelectorChanged = event => {
    this.props.onPropertySelectorChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleAttributeChanged = event => {
    this.props.onAttributeChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handlePropertyPickerFind = event => {
    this.handleFind(FindSelectorTypes.PROPERTY, event);
  };

  handleFind = (findType, event) => {
    this.props.onFind({
      ruleKey: this.props.ruleKey,
      findType: findType,
      ...event,
    });
  };

  handleDateTimeFormatChanged = event => {
    this.props.onDateTimeFormatChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleRemove = event => {
    event.preventDefault();

    this.props.onRemove({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleToggle = event => {
    this.setState((prevState, props) => ({
      collapsed: ! prevState.collapsed
    }));
  }

  render() {
    const firstRuleOption = this.props.showEmptyRuleOption ? (
      <option value={null}>Select a Rule...</option>
    ) : null;
    const disabled = !this.props.showEmptyRuleOption;

    const ruleSettings = !this.props.showEmptyRuleOption ? (
      <div className="rule-settings">
        <div className="field-line">
          <label htmlFor={this.props.class}>Selector</label>
          <SelectorPicker
            name={this.props.class}
            selector={this.props.selector}
            multiple="true"
            finding={
              this.props.finding &&
              this.props.findType === FindSelectorTypes.RULE
            }
            onSelectorChanged={this.handleSelectorChanged}
            onFind={this.handleRuleSelectorPickerFind}
          />
        </div>
        {Object.entries(this.props.properties).map(
          ([propertyName, property]) => (
            <PropertyPicker
              name={propertyName}
              key={propertyName}
              {...property}
              onSelectorChanged={this.handlePropertyPickerSelectorChanged}
              onFocus={this.handlePropertyPickerSelectorChanged}
              onAttributeChanged={this.handleAttributeChanged}
              onDateTimeFormatChanged={this.handleDateTimeFormatChanged}
              onFind={this.handlePropertyPickerFind}
              active={
                this.props.active &&
                this.props.activePropertyName === propertyName
              }
              finding={
                this.props.finding &&
                this.props.findType === FindSelectorTypes.PROPERTY &&
                this.props.findAttributeName === propertyName
              }
            />
          )
        )}
      </div>
    ) : null;

    const toggler = this.state.collapsed
      ? '\u25B6'  // right triangle
      : '\u25BC'; // down triangle

    const ruleSelector = this.props.showEmptyRuleOption ? (
      <select
        className="rule-selector"
        defaultValue={this.props.ruleKey}
        onChange={this.handleRuleChanged}
      >
        {firstRuleOption}
        {this.props.availableRules.map(availableRule => (
          <option key={availableRule.index} value={availableRule.index}>
            {availableRule.displayName}
          </option>
        ))}
      </select>
    ) : (
      <h2 className="rule-header" onClick={this.handleToggle}>
        {toggler} {this.props.displayName}
      </h2>
    );

    const classes = classNames({
      "selectors-form": true,
      "collapsed": !! this.state.collapsed,
    });

    return (
      <form className={classes}>
        {ruleSelector}
        <button className="btn-close" onClick={this.handleRemove}>
          &#10006;
        </button>
        {ruleSettings}
      </form>
    );
  }
}

module.exports = RulePicker;
