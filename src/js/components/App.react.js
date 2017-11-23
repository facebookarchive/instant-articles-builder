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
const Browser = require('./Browser.react.js');
const RuleList = require('./RuleList.react.js');

import type { Attribute } from '../types/Attribute';
import type { InputRule } from '../types/InputRule';

type Props = {
  rules: Array<InputRule>
};

type State = {
  findAttributeName?: ?string,
  findMultipleElements?: ?boolean,
  resolvedCssSelector: ?string,
  selectedElementAttributes: Array<Attribute>,
  selectedElementCount?: number,
  selector?: ?string,
  rulesJSON: ?string
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resolvedCssSelector: null,
      selectedElementAttributes: [],
      rulesJSON: '{rules:[]}',
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', this.cancelOnEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.cancelOnEscape);
  }

  cancelOnEscape = (e: Event) => {
    // Handle element selection cancelation on 'esc' press
    if (e.keyCode == 27 && !!this.state.findAttributeName) {
      // escape key maps to keycode `27`
      this.ruleListFindCancel();
    }
  };

  toNameValueAttributes(attributes: Map<string, string>): Array<Attribute> {
    return [...attributes].map(([name, value]) => {
      return {
        name,
        value,
      };
    });
  }

  receiveAttributes = (
    selector: string,
    attributes: Map<string, string>,
    count: number
  ) => {
    this.setState({
      selectedElementAttributes: this.toNameValueAttributes(attributes),
      selectedElementCount: count,
    });
  };

  handleBrowserCssSelectorResolved = (resolvedCssSelector: ?string) => {
    this.setState({
      resolvedCssSelector: resolvedCssSelector,
      selectedElementAttributes: [],
      findAttributeName: null,
      findMultipleElements: null,
    });
  };

  handleRuleListSelectorChanged = (selector: ?string, multiple: ?boolean) => {
    this.setState({
      selector: selector,
      findAttributeName: null,
      findMultipleElements: multiple,
    });
  };

  handleRuleListFind = (attributeName: string, multiple: boolean) => {
    this.setState({
      selector: null,
      findAttributeName: attributeName,
      findMultipleElements: multiple,
    });
  };

  handleRulesJSONChanged = (rulesJSON: string) => {
    this.setState({
      rulesJSON: rulesJSON,
    });
  };

  ruleListFindCancel() {
    this.setState({
      selector: null,
      findAttributeName: null,
      findMultipleElements: null,
    });
  }

  render() {
    return (
      <div id="wrapper">
        <header>
          <img src="../img/logo-48.png" />
          <h1>Rules Editor</h1>
        </header>
        <div id="content-wrapper">
          <main id="content">
            <Browser
              selector={this.state.selector}
              rulesJSON={this.state.rulesJSON}
              findAttribute={this.state.findAttributeName !== null}
              findMultipleElements={this.state.findMultipleElements}
              onAttributesReceived={this.receiveAttributes}
              onCssSelectorResolved={this.handleBrowserCssSelectorResolved}
            />
          </main>
          <nav id="nav">
            <RuleList
              rules={this.props.rules}
              resolvedCssSelector={this.state.resolvedCssSelector}
              selectedElementAttributes={this.state.selectedElementAttributes}
              selectedElementCount={this.state.selectedElementCount}
              onSelectorChanged={this.handleRuleListSelectorChanged}
              onRulesJSONChanged={this.handleRulesJSONChanged}
              onFind={this.handleRuleListFind}
              findAttributeName={this.state.findAttributeName}
              finding={this.state.findAttributeName !== null}
            />
          </nav>
        </div>
      </div>
    );
  }
}

module.exports = App;
