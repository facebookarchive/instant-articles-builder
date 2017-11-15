/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const RulePicker = require('./RulePicker.react.js');

const FindSelectorTypes = require('../find-selector-types.js');
const NameUtils = require('../utils/name-utils.js');
const RuleUtils = require('../utils/rule-utils.js');

const { dialog: Dialog } = require('electron').remote;
const Fs = require('fs');

class RuleList extends React.Component {
  constructor(props) {
    super(props);

    const visibleRulesSettings = {};
    let allAvailableRules = [];

    if (props.rules) {
      allAvailableRules = props.rules
        .map((inputRule, ruleIndex) => {
          if (inputRule.showByDefault) {
            const currentRuleSettings = this.getRuleSettingsFromInputRule(
              inputRule
            );
            visibleRulesSettings[ruleIndex] = currentRuleSettings;
          }
          return {
            displayName: NameUtils.getInputRuleDisplayName(inputRule),
            index: ruleIndex,
          };
        })
        .sort(
          (a, b) =>
            a.displayName > b.displayName
              ? 1
              : a.displayName < b.displayName ? -1 : 0
        );
    }

    this.state = {
      rulesSettings: visibleRulesSettings,
      maxRuleKey: props.rules.length - 1,
      allAvailableRules: allAvailableRules,
    };
  }

  getRuleSettings(ruleKey) {
    return this.state.rulesSettings[ruleKey];
  }

  getActiveRuleSettings() {
    return this.getRuleSettings(this.state.activeRuleKey);
  }

  getActivePropertySettings() {
    return this.getPropertySettings(
      this.state.activeRuleKey,
      this.state.activePropertyName
    );
  }

  getPropertySettings(ruleKey, propertyName) {
    return this.getRuleSettings(ruleKey).properties[propertyName];
  }

  getRuleSettingsFromInputRule(inputRule) {
    const { defaultSelector: selector, ...reducedInputRule } = inputRule;
    const ruleSettings = {
      ...reducedInputRule,
      selector,
      properties: {},
    };

    if (!ruleSettings.displayName) {
      ruleSettings.displayName = NameUtils.getInputRuleDisplayName(inputRule);
    }

    if (inputRule.properties) {
      inputRule.properties.forEach(property => {
        ruleSettings.properties[property.name] = {
          ...property,
          attributes: [],
        };
      });
    }

    return ruleSettings;
  }

  handleRulePickerRuleChanged = e => {
    const inputRule = this.props.rules[e.selectedInputRuleIndex];
    const newRuleSettings = this.getRuleSettingsFromInputRule(inputRule);
    const rulesSettings = {
      ...this.state.rulesSettings,
      [e.ruleKey]: newRuleSettings,
    };
    this.setState({
      rulesSettings: rulesSettings,
    });
  };

  handleRulePickerSelectorChanged = e => {
    const selector = e.selector
      ? e.selector
      : rulesSettings[e.ruleKey].selector
        ? rulesSettings[e.ruleKey].selector
        : null;
    const ruleSettings = this.state.rulesSettings[e.ruleKey];
    const newRuleSettings = {
      ...ruleSettings,
      selector: selector,
    };
    const rulesSettings = {
      ...this.state.rulesSettings,
      [e.ruleKey]: newRuleSettings,
    };

    this.setState({
      rulesSettings: rulesSettings,
    });

    this.props.onSelectorChanged(e.selector, e.multiple);
  };

  handleRulePickerPropertySelectorChanged = e => {
    let ruleSettings = this.getRuleSettings(e.ruleKey);
    let propertySettings = this.getPropertySettings(e.ruleKey, e.name);
    // Only update if we have a new selector (we could be selecting a different text box)
    if (propertySettings.selector !== e.selector) {
      let newPropertySettings = {
        ...propertySettings,
        selector: e.selector,
        // Clear attributes, they will get populated by browser
        attributes: [],
        count: 0,
      };
      ruleSettings.properties[e.name] = newPropertySettings;
    }

    // TODO: State should be immutable
    this.setState({
      activeRuleKey: e.ruleKey,
      activePropertyName: e.name,
      rulesSettings: this.state.rulesSettings,
    });

    this.onSelectorChanged(ruleSettings.selector, e.selector, e.multiple);
  };

  onSelectorChanged(ruleSelector, propertySelector, multiple) {
    // Create new selector based on selector of the parent rule
    // Note: Assumes rules cannot be nested
    const scopedSelector =
      ruleSelector && propertySelector
        ? ruleSelector + ' ' + propertySelector
        : propertySelector;
    this.props.onSelectorChanged(scopedSelector, multiple);
  }

  handleRulePickerAttributeChanged = e => {
    let propertySettings = this.getPropertySettings(e.ruleKey, e.propertyName);
    propertySettings.selectedAttribute = e.attribute;

    // TODO: State should be immutable
    this.setState({
      rulesSettings: this.state.rulesSettings,
    });
  };

  handleRulePickerDateTimeFormatChanged = e => {
    let propertySettings = this.getPropertySettings(e.ruleKey, e.propertyName);
    propertySettings.dateTimeFormat = e.format;

    // TODO: State should be immutable
    this.setState({
      rulesSettings: this.state.rulesSettings,
    });
  };

  handleRulePickerRemove = e => {
    const { [e.ruleKey]: deleted, ...rulesSettings } = this.state.rulesSettings;

    this.setState({
      rulesSettings: rulesSettings,
    });
  };

  handleRulePickerFind = e => {
    this.setState({
      activeRuleKey: e.ruleKey,
      activePropertyName: e.name,
      activeFindType: e.findType,
    });
    this.props.onFind(e.name, e.multiple);
  };

  handleAddRule = e => {
    const newRuleKey = this.state.maxRuleKey + 1;
    const newRuleSettings = {
      class: '',
      selector: '',
      properties: {},
    };
    const rulesSettings = {
      ...this.state.rulesSettings,
      [newRuleKey]: newRuleSettings,
    };

    this.setState({
      rulesSettings: rulesSettings,
      maxRuleKey: newRuleKey,
    });

    e.preventDefault();
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedElementAttributes !==
        this.props.selectedElementAttributes &&
      this.state.activeFindType !== FindSelectorTypes.RULE
    ) {
      // TODO: State should be immutable
      // Update the attributes for the item that have the selector
      const activePropertySettings = this.getActivePropertySettings();
      activePropertySettings.attributes = nextProps.selectedElementAttributes;
      activePropertySettings.count = nextProps.selectedElementCount;

      this.setState({
        rulesSettings: this.state.rulesSettings,
      });
    }

    if (nextProps.resolvedCssSelector !== this.props.resolvedCssSelector) {
      // TODO: State should be immutable
      // Update the selector for the item that changed
      if (this.state.activeFindType === FindSelectorTypes.PROPERTY) {
        const activePropertySettings = this.getActivePropertySettings();
        activePropertySettings.selector = nextProps.resolvedCssSelector;
      } else if (this.state.activeFindType === FindSelectorTypes.RULE) {
        const activeRuleSettings = this.getActiveRuleSettings();
        activeRuleSettings.selector = nextProps.resolvedCssSelector;
      }

      this.setState({
        selector: null,
        rulesSettings: this.state.rulesSettings,
      });
    }
  }

  handleExport = e => {
    let exportedRules = [];
    Object.entries(this.state.rulesSettings).forEach(
      ([ruleKey, ruleSettings]) => {
        let exportedRuleSettings = {
          ...ruleSettings,
          properties: {},
        };
        exportedRules.push(exportedRuleSettings);

        Object.entries(ruleSettings.properties).forEach(
          ([propertyName, property]) => {
            if (property.selector && property.selectedAttribute) {
              let exportedProperty = {
                selector: property.selector,
                attribute: property.selectedAttribute.name,
              };
              if (property.dateTimeFormat) {
                exportedProperty.dateTimeFormat = property.dateTimeFormat;
              }

              exportedRuleSettings.properties[propertyName] = exportedProperty;
            }
          }
        );
      }
    );

    Dialog.showSaveDialog(
      {
        defaultPath: 'rules.json',
        filters: [
          {
            name: 'JSON',
            extensions: ['json', 'txt'],
          },
        ],
      },
      fileName => {
        if (fileName) {
          const contents = JSON.stringify(
            RuleUtils.getUpdatedRules(exportedRules),
            null,
            2
          );
          Fs.writeFile(fileName, contents, error => {
            if (error) {
              Dialog.showErrorBox('Unable to save file', error);
            }
          });
        }
      }
    );

    e.preventDefault();
  };

  render() {
    return (
      <div className="left-scollable">
        {Object.entries(this.state.rulesSettings).map(
          ([ruleKey, ruleSettings]) => (
            <RulePicker
              // This field is required by React
              key={ruleKey}
              // This is the key the child components will use to identify
              // themselves when raising events
              ruleKey={ruleKey}
              {...ruleSettings}
              availableRules={this.state.allAvailableRules}
              showEmptyRuleOption={!ruleSettings.class}
              onRuleChanged={this.handleRulePickerRuleChanged}
              onSelectorChanged={this.handleRulePickerSelectorChanged}
              onPropertySelectorChanged={
                this.handleRulePickerPropertySelectorChanged
              }
              onAttributeChanged={this.handleRulePickerAttributeChanged}
              onDateTimeFormatChanged={
                this.handleRulePickerDateTimeFormatChanged
              }
              onRemove={this.handleRulePickerRemove}
              onFind={this.handleRulePickerFind}
              active={this.state.activeRuleKey === ruleKey}
              activePropertyName={this.state.activePropertyName}
              findAttributeName={
                this.state.activeRuleKey === ruleKey
                  ? this.props.findAttributeName
                  : null
              }
              finding={
                this.state.activeRuleKey === ruleKey &&
                this.props.findAttributeName !== null
              }
              findType={
                this.state.activeRuleKey === ruleKey
                  ? this.state.activeFindType
                  : null
              }
            />
          )
        )}
        <button className="button" onClick={this.handleExport}>
          Export
        </button>
        <button className="button" onClick={this.handleAddRule}>
          Add Rule
        </button>
      </div>
    );
  }
}

module.exports = RuleList;
