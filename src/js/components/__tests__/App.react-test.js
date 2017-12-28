/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Adapter = require('enzyme-adapter-react-15');
const Enzyme = require('enzyme');
const { mount } = Enzyme;

const React = require('react');
const App = require('../App.react.js');

const RULE_HEADER_SELECTOR = 'h2.rule-header';

// Initialize Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('should skip duplicated rules', () => {
    // Randomize the rule name
    const ruleClassName = `SomeRule${Math.random()}`;
    const inputRules = [
      {
        class: ruleClassName,
        showByDefault: true,
      },
      {
        class: 'SomeOtherRule',
        showByDefault: true,
      },
      {
        class: ruleClassName, // duplicate
        showByDefault: true,
      },
    ];

    // Mount the app with the input rules above
    const component = mount(
      <App rulesByClassName={inputRulesToMap(inputRules)} />
    );

    // We have 3 rules, but we are skipping one
    expect(component.find(RULE_HEADER_SELECTOR).length).toBe(2);
  });

  it('should sort rules by display name', () => {
    const inputRules = [
      {
        class: 'Rule1',
        displayName: 'Rule X3 (Expected Third)',
        showByDefault: false,
      },
      {
        class: 'Rule2',
        displayName: 'Rule X2 (Expected Second)',
        showByDefault: false,
      },
      {
        class: 'Rule3',
        displayName: 'Rule X1 (Expected First)',
        showByDefault: false,
      },
    ];

    // Mount the app with the input rules above
    const component = mount(
      <App rulesByClassName={inputRulesToMap(inputRules)} />
    );
    // Simulate a click in the Add Rule button
    component.find('#add-rule-button').simulate('click');
    const rulesSelect = component.find('select.rule-selector');

    expect(rulesSelect.children().length).toBe(inputRules.length + 1);
    // Skip the empty option, then ensure the option texts are sorted
    for (let childIndex = 2; childIndex <= inputRules.length; childIndex++) {
      expect(
        rulesSelect.childAt(childIndex).text() >=
          rulesSelect.childAt(childIndex - 1).text()
      ).toBeTruthy();
    }
  });
});

function inputRulesToMap(inputRules) {
  return new Map(inputRules.map(inputRule => [inputRule.class, inputRule]));
}
