/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

let React = require('react');
let Browser = require('./Browser.react.js');
let RuleList = require('./RuleList.react.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.ruleListFindCancel = this.ruleListFindCancel.bind(this);

    this.state = {
      resolvedCssSelector: null,
      selectedElementAttributes: [],
    };

    this.cancelOnEscape = this.cancelOnEscape.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.cancelOnEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.cancelOnEscape);
  }

  cancelOnEscape(e) {
    // Handle element selection cancelation on 'esc' press
    if (e.keyCode == 27 && !!this.state.findAttributeName) {
      // escape key maps to keycode `27`
      this.ruleListFindCancel();
    }
  }

  toNameValueAttributes(attributes) {
    return Object.entries(attributes).map(([name, value]) => {
      return {
        name,
        value,
      };
    });
  }

  receiveAttributes = (selector, attributes, count) => {
    this.setState({
      selectedElementAttributes: this.toNameValueAttributes(attributes),
      selectedElementCount: count,
    });
  };

  handleBrowserCssSelectorResolved = resolvedCssSelector => {
    this.setState({
      resolvedCssSelector: resolvedCssSelector,
      selectedElementAttributes: [],
      findAttributeName: null,
      findMultipleElements: null,
    });
  };

  handleRuleListSelectorChanged = (selector, multiple) => {
    this.setState({
      selector: selector,
      findAttributeName: null,
      findMultipleElements: multiple,
    });
  };

  handleRuleListFind = (attributeName, multiple) => {
    this.setState({
      selector: null,
      findAttributeName: attributeName,
      findMultipleElements: multiple,
    });
  };

  ruleListFindCancel() {
    this.setState({
      selector: null,
      findAttributeName: null,
      findMultipleElements: null,
    });
  }

  render(){
    return (
      <div id="wrapper">
        <header>
          <img src="../img/logo-48.png"/>
          <h1>Rules Editor</h1>
        </header>
        <div id="content-wrapper">
          <main id="content">
            <Browser
              selector={this.state.selector}
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
