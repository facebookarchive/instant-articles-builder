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
const SelectorPicker = require('./SelectorPicker.react.js');
const FindSelectorTypes = require('../types/FindSelectorTypes.js');
const classNames = require('classnames');

import type { AvailableRule } from '../types/AvailableRule';
import type { AttributeChangedArgs } from '../types/AttributeChangedArgs';
import type { DateTimeFormatChangedArgs } from '../types/DateTimeFormatChangedArgs';
import type { PropertySettings } from '../types/PropertySettings';
import type { RemoveRuleArgs } from '../types/RemoveRuleArgs';
import type { RuleAttributeChangedArgs } from '../types/RuleAttributeChangedArgs';
import type { RuleChangedArgs } from '../types/RuleChangedArgs';
import type { RuleDateTimeFormatChangedArgs } from '../types/RuleDateTimeFormatChangedArgs';
import type { RuleSelectorChangedArgs } from '../types/RuleSelectorChangedArgs';
import type { RuleSelectorFindArgs } from '../types/RuleSelectorFindArgs';
import type { SelectorChangedArgs } from '../types/SelectorChangedArgs';
import type { SelectorFindArgs } from '../types/SelectorFindArgs';

type Props = {
  active: boolean,
  activePropertyName?: string,
  availableRules: Array<AvailableRule>,
  class: string,
  displayName: string,
  finding: boolean,
  findAttributeName: ?string,
  findType: ?number,
  onAttributeChanged: RuleAttributeChangedArgs => void,
  onDateTimeFormatChanged: RuleDateTimeFormatChangedArgs => void,
  onFind: RuleSelectorFindArgs => void,
  onPropertySelectorChanged: RuleSelectorChangedArgs => void,
  onRemove: RemoveRuleArgs => void,
  onRuleChanged: RuleChangedArgs => void,
  onSelectorChanged: RuleSelectorChangedArgs => void,
  properties: Map<string, PropertySettings>,
  ruleKey: string,
  selector: ?string
};

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

  handleRuleChanged = (event: Event) => {
    const selectElement = event.target;
    if (selectElement instanceof HTMLSelectElement) {
      this.props.onRuleChanged({
        ruleKey: this.props.ruleKey,
        selectedInputRuleIndex: Number(selectElement.value),
      });
    }
  };

  handleSelectorChanged = (event: SelectorChangedArgs) => {
    this.props.onSelectorChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleRuleSelectorPickerFind = (event: SelectorFindArgs) => {
    this.handleFind(FindSelectorTypes.RULE, event);
  };

  handlePropertyPickerSelectorChanged = (event: SelectorChangedArgs) => {
    this.props.onPropertySelectorChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleAttributeChanged = (event: AttributeChangedArgs) => {
    this.props.onAttributeChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handlePropertyPickerFind = (event: SelectorFindArgs) => {
    this.handleFind(FindSelectorTypes.PROPERTY, event);
  };

  handleFind = (findType: number, event: SelectorFindArgs) => {
    this.props.onFind({
      ruleKey: this.props.ruleKey,
      findType: findType,
      ...event,
    });
  };

  handleDateTimeFormatChanged = (event: DateTimeFormatChangedArgs) => {
    this.props.onDateTimeFormatChanged({
      ruleKey: this.props.ruleKey,
      ...event,
    });
  };

  handleRemove = (event: Event) => {
    event.preventDefault();

    this.props.onRemove({
      ruleKey: this.props.ruleKey,
    });
  };

  handleToggle = () => {
    this.setState((prevState, props) => ({
      collapsed: !prevState.collapsed,
    }));
  };

  render() {
    const firstRuleOption = this.props.showEmptyRuleOption ? (
      <option value={null}>Select a Rule...</option>
    ) : null;

    const ruleSettings = !this.props.showEmptyRuleOption ? (
      <div className="rule-settings">
        <div className="field-line">
          <label htmlFor={this.props.class}>Selector</label>
          <SelectorPicker
            name={this.props.class}
            selector={this.props.selector}
            multiple={true}
            finding={
              this.props.finding &&
              this.props.findType === FindSelectorTypes.RULE
            }
            onSelectorChanged={this.handleSelectorChanged}
            onFind={this.handleRuleSelectorPickerFind}
          />
        </div>
        {[...this.props.properties].map(([propertyName, property]) => (
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
        ))}
      </div>
    ) : null;

    const toggler = this.state.collapsed
      ? '\u25B6' // right triangle
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
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <h2 className="rule-header" onClick={this.handleToggle}>
        {toggler} {this.props.displayName}
      </h2>
    );

    const classes = classNames({
      'selectors-form': true,
      collapsed: !!this.state.collapsed,
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
