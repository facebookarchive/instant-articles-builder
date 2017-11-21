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
const RulePicker = require('./RulePicker.react.js');

const FindSelectorTypes = require('../types/FindSelectorTypes.js');
const NameUtils = require('../utils/name-utils.js');
const RuleUtils = require('../utils/rule-utils.js');

const { dialog: Dialog } = require('electron').remote;
const Fs = require('fs');

import type { AvailableRuleType } from '../types/AvailableRuleType';
import type { AttributeType } from '../types/AttributeType';
import type { PropertySettingsType } from '../types/PropertySettingsType';
import type { RemoveRuleArgs } from '../types/RemoveRuleArgs';
import type { RuleAttributeChangedArgs } from '../types/RuleAttributeChangedArgs';
import type { RuleChangedArgs } from '../types/RuleChangedArgs';
import type { RuleDateTimeFormatChangedArgs } from '../types/RuleDateTimeFormatChangedArgs';
import type { RuleSelectorChangedArgs } from '../types/RuleSelectorChangedArgs';
import type { RuleSelectorFindArgs } from '../types/RuleSelectorFindArgs';

type Props = {
  findAttributeName: string,
  onFind: (name: string, multiple: boolean) => void,
  onSelectorChanged: (selector: ?string, multiple: ?boolean) => void,
  resolvedCssSelector: string,
  rules: Array<InputRuleType>,
  selectedElementAttributes: Array<AttributeType>,
  selectedElementCount: number
};

type State = {
  activeFindType?: number,
  activePropertyName?: string,
  activeRuleKey?: string,
  allAvailableRules: Array<AvailableRuleType>,
  maxRuleKey: number,
  rulesSettings: Map<string, RuleSettingsType>
};

type RuleSettingsType = {
  class: string,
  displayName?: string,
  properties: Map<string, PropertySettingsType>,
  selector: string
};

type InputRuleType = {
  class: string,
  defaultSelector: string,
  properties: Map<string, InputPropertyType>,
  showByDefault: boolean
};

type InputPropertyType = {
  dateTimeFormat?: string,
  defaultAttribute: string,
  label: string,
  multiple?: boolean,
  name: string,
  placeholder: string,
  // selector?: string,
  type?: string
};

type OutputRuleType = {
  class: string,
  selector: string,
  properties: Object
};

type OutputPropertyType = {
  attribute: string,
  dateTimeFormat?: string,
  selector: string
};

class RuleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const visibleRulesSettings: Map<string, RuleSettingsType> = new Map();
    let allAvailableRules = [];

    if (props.rules) {
      allAvailableRules = props.rules
        .map((inputRule, ruleIndex) => {
          if (inputRule.showByDefault) {
            const currentRuleSettings = this.getRuleSettingsFromInputRule(
              inputRule
            );
            visibleRulesSettings.set(ruleIndex.toString(), currentRuleSettings);
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

  getRuleSettings(ruleKey: string): ?RuleSettingsType {
    return this.state.rulesSettings.get(ruleKey);
  }

  getActiveRuleSettings(): ?RuleSettingsType {
    return this.state.activeRuleKey
      ? this.getRuleSettings(this.state.activeRuleKey)
      : null;
  }

  getActivePropertySettings(): ?PropertySettingsType {
    return this.state.activeRuleKey && this.state.activePropertyName
      ? this.getPropertySettings(
        this.state.activeRuleKey,
        this.state.activePropertyName
      )
      : null;
  }

  getPropertySettings(
    ruleKey: string,
    propertyName: string
  ): ?PropertySettingsType {
    const ruleSettings = this.getRuleSettings(ruleKey);
    return ruleSettings ? ruleSettings.properties.get(propertyName) : null;
  }

  getRuleSettingsFromInputRule(inputRule: InputRuleType): RuleSettingsType {
    const {
      defaultSelector: selector,
      properties: inputRuleProperties,
      ...reducedInputRule
    } = inputRule;
    const ruleSettings: RuleSettingsType = {
      ...reducedInputRule,
      selector,
      properties: new Map(),
    };

    if (!ruleSettings.displayName) {
      ruleSettings.displayName = NameUtils.getInputRuleDisplayName(inputRule);
    }

    if (inputRuleProperties) {
      inputRuleProperties.forEach(property => {
        ruleSettings.properties.set(property.name, {
          ...property,
          attributes: [],
        });
      });
    }

    return ruleSettings;
  }

  handleRulePickerRuleChanged = (e: RuleChangedArgs) => {
    const inputRule = this.props.rules[e.selectedInputRuleIndex];
    const newRuleSettings = this.getRuleSettingsFromInputRule(inputRule);

    const rulesSettings: Map<string, RuleSettingsType> = new Map(
      this.state.rulesSettings
    );
    rulesSettings.set(e.ruleKey, newRuleSettings);

    this.setState({
      rulesSettings: rulesSettings,
    });
  };

  handleRulePickerSelectorChanged = (e: RuleSelectorChangedArgs) => {
    const selector = e.selector;
    const ruleSettings = this.getRuleSettings(e.ruleKey);
    const newRuleSettings = {
      ...ruleSettings,
      selector,
    };

    const rulesSettings: Map<string, RuleSettingsType> = new Map(
      this.state.rulesSettings
    );
    rulesSettings.set(e.ruleKey, newRuleSettings);

    this.setState({
      rulesSettings: rulesSettings,
    });

    this.props.onSelectorChanged(e.selector, e.multiple);
  };

  handleRulePickerPropertySelectorChanged = (e: RuleSelectorChangedArgs) => {
    const ruleSettings = this.getRuleSettings(e.ruleKey);
    if (!ruleSettings) {
      return;
    }

    const propertySettings = this.getPropertySettings(e.ruleKey, e.name);
    // Only update if we have a new selector (we could be selecting a different
    // text box)
    if (propertySettings && propertySettings.selector !== e.selector) {
      const newPropertySettings = {
        ...propertySettings,
        selector: e.selector,
        // Clear attributes, they will get populated by browser
        attributes: [],
        count: 0,
      };
      ruleSettings.properties.set(e.name, newPropertySettings);
    }

    // TODO: State should be immutable
    this.setState({
      activeRuleKey: e.ruleKey,
      activePropertyName: e.name,
      rulesSettings: this.state.rulesSettings,
    });

    this.onSelectorChanged(ruleSettings.selector, e.selector, e.multiple);
  };

  onSelectorChanged(
    ruleSelector: string,
    propertySelector: string,
    multiple: boolean
  ) {
    // Create new selector based on selector of the parent rule
    // Note: Assumes rules cannot be nested
    const scopedSelector =
      ruleSelector && propertySelector
        ? ruleSelector + ' ' + propertySelector
        : propertySelector;
    this.props.onSelectorChanged(scopedSelector, multiple);
  }

  handleRulePickerAttributeChanged = (e: RuleAttributeChangedArgs) => {
    const propertySettings = this.getPropertySettings(
      e.ruleKey,
      e.propertyName
    );
    if (!propertySettings) {
      return;
    }

    propertySettings.selectedAttribute = e.attribute;

    // TODO: State should be immutable
    this.setState({
      rulesSettings: this.state.rulesSettings,
    });
  };

  handleRulePickerDateTimeFormatChanged = (
    e: RuleDateTimeFormatChangedArgs
  ) => {
    let propertySettings = this.getPropertySettings(e.ruleKey, e.propertyName);
    if (!propertySettings) {
      return;
    }

    propertySettings.dateTimeFormat = e.format;

    // TODO: State should be immutable
    this.setState({
      rulesSettings: this.state.rulesSettings,
    });
  };

  handleRulePickerRemove = (e: RemoveRuleArgs) => {
    const rulesSettings = new Map(this.state.rulesSettings);
    rulesSettings.delete(e.ruleKey);

    this.setState({
      rulesSettings: rulesSettings,
    });
  };

  handleRulePickerFind = (e: RuleSelectorFindArgs) => {
    this.setState({
      activeRuleKey: e.ruleKey,
      activePropertyName: e.name,
      activeFindType: e.findType,
    });
    this.props.onFind(e.name, e.multiple);
  };

  handleAddRule = (e: Event) => {
    const newRuleKey = this.state.maxRuleKey + 1;
    const newRuleSettings = {
      class: '',
      selector: '',
      properties: new Map(),
    };

    const rulesSettings: Map<string, RuleSettingsType> = new Map(
      this.state.rulesSettings
    );
    rulesSettings.set(newRuleKey.toString(), newRuleSettings);

    this.setState({
      rulesSettings: rulesSettings,
      maxRuleKey: newRuleKey,
    });

    e.preventDefault();
  };

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.selectedElementAttributes !==
        this.props.selectedElementAttributes &&
      this.state.activeFindType !== FindSelectorTypes.RULE
    ) {
      // TODO: State should be immutable
      // Update the attributes for the item that have the selector
      const activePropertySettings = this.getActivePropertySettings();

      if (activePropertySettings) {
        activePropertySettings.attributes = nextProps.selectedElementAttributes;
        activePropertySettings.count = nextProps.selectedElementCount;

        this.setState({
          rulesSettings: this.state.rulesSettings,
        });
      }
    }

    if (nextProps.resolvedCssSelector !== this.props.resolvedCssSelector) {
      // TODO: State should be immutable
      // Update the selector for the item that changed
      if (this.state.activeFindType === FindSelectorTypes.PROPERTY) {
        const activePropertySettings = this.getActivePropertySettings();
        if (activePropertySettings) {
          activePropertySettings.selector = nextProps.resolvedCssSelector;
        }
      } else if (this.state.activeFindType === FindSelectorTypes.RULE) {
        const activeRuleSettings = this.getActiveRuleSettings();
        if (activeRuleSettings) {
          activeRuleSettings.selector = nextProps.resolvedCssSelector;
        }
      }

      this.setState({
        rulesSettings: this.state.rulesSettings,
      });
    }
  }

  handleExport = (e: Event) => {
    const exportedRules: Array<OutputRuleType> = [];
    [...this.state.rulesSettings].forEach(([ruleKey, ruleSettings]) => {
      const exportedRuleSettings: OutputRuleType = {
        ...ruleSettings,
        properties: {},
      };
      exportedRules.push(exportedRuleSettings);

      [...ruleSettings.properties].forEach(([propertyName, property]) => {
        if (property.selector && property.selectedAttribute) {
          const exportedProperty: OutputPropertyType = {
            selector: property.selector,
            attribute: property.selectedAttribute.name,
          };
          if (property.dateTimeFormat) {
            exportedProperty.dateTimeFormat = property.dateTimeFormat;
          }

          exportedRuleSettings.properties[propertyName] = exportedProperty;
        }
      });
    });

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
      <div>
        {[...this.state.rulesSettings].map(([ruleKey, ruleSettings]) => (
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
            onDateTimeFormatChanged={this.handleRulePickerDateTimeFormatChanged}
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
        ))}
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
