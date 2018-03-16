/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

jest.mock('fs');
const fs = require('fs');

const Adapter = require('enzyme-adapter-react-15');
const Enzyme = require('enzyme');
const { mount } = Enzyme;

const React = require('react');

const defaultAttributionInfo = {
  generator_name: 'facebook-instant-articles-rules-editor',
  generator_version: '0.0.0',
};

// Rules that are always included in the exported file
const defaultExportedRules = [{ class: 'TextNodeRule' }];

const RULE_HEADER_SELECTOR = 'h2.rule-header';

import { RuleDefinitionFactory } from '../../models/RuleDefinition';
import { RulePropertyDefinitionFactory } from '../../models/RulePropertyDefinition';
import RuleDefinitionActions from '../../data/RuleDefinitionActions';
import { Map } from 'immutable';
import AppContainer from '../../containers/AppContainer.react';

// Initialize Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

describe('RuleList', () => {
  it('should export only default rules', () => {
    // Set this function as the one that will be called as fs.writeFile
    fs.__setWriteFileCallback((fileName, contents, encoding, errorCallback) => {
      // Expected exported object has no rules
      const expectedContents = {
        ...defaultAttributionInfo,
        rules: [...defaultExportedRules],
      };
      expect(JSON.parse(contents)).toEqual(expectedContents);
    });

    simlulateExport();
  });

  it('should export with utf8 encoding', () => {
    fs.__setWriteFileCallback((fileName, contents, encoding, errorCallback) => {
      expect(encoding).toEqual('utf8');
    });

    simlulateExport();
  });

  it('should import with utf8 encoding', () => {
    fs.__setReadFileCallback((filePaths, encoding, callback) => {
      expect(encoding).toEqual('utf8');
    });

    simlulateImport();
  });

  it('should show imported rule display name', () => {
    // Randomize the rule class name
    const ruleClassName = 'SomeRule' + Math.random().toString();
    // Randomize the rule display name
    const ruleDisplayName = 'Rule' + Math.random().toString();
    const inputRules = [
      RuleDefinitionFactory({
        // Will be matched with the one from the imported file
        name: ruleClassName,
        displayName: ruleDisplayName,
      }),
    ];
    // The contents of the file that will be imported
    const importedRules = [
      {
        class: ruleClassName, // same name, so it is matched
        selector: 'other',
      },
    ];

    testImportedFileResult(inputRules, importedRules, component =>
      expect(
        component.findWhere(
          // Expected to find a single element with the display name
          node =>
            node.is(RULE_HEADER_SELECTOR) &&
            node.text().includes(ruleDisplayName)
        ).length
      ).toBe(1)
    );
  });

  it('should not show imported rule that is not matched', () => {
    // Randomize the rule class name
    const inputRuleClassName = 'SomeRule' + Math.random().toString();
    const inputRules = [
      RuleDefinitionFactory({
        // Will NOT be matched with the one from the imported file
        name: inputRuleClassName,
      }),
    ];
    // The contents of the file that will be imported
    const importedRules = [
      {
        class: inputRuleClassName + 'XYZ', // ensure it is different
        selector: 'other',
      },
    ];

    testImportedFileResult(inputRules, importedRules, component =>
      expect(component.find(RULE_HEADER_SELECTOR).length).toBe(0)
    );
  });

  it('should show imported rule selector', () => {
    // Randomize the rule class name
    const ruleClassName = 'SomeRule' + Math.random().toString();
    // Randomize the selector
    const selector = 'SomeSelector' + Math.random().toString();
    const inputRules = [
      RuleDefinitionFactory({
        name: ruleClassName,
      }),
    ];
    // The contents of the file that will be imported
    const importedRules = [
      {
        class: ruleClassName, // same name, so it is matched
        selector: selector,
      },
    ];

    testImportedFileResult(inputRules, importedRules, component =>
      // Expect to find a text box that is a child of the rule with the selector
      expect(
        component.find(`input[name="${ruleClassName}"][value="${selector}"]`)
          .length
      ).toBe(1)
    );
  });

  it('should show imported rule property selector', () => {
    // Randomize the property name
    const propertyName = 'SomeProperty' + Math.random().toString();
    // Randomize the selector
    const selector = 'SomeSelector' + Math.random().toString();
    const ruleClassName = 'SomeRule';
    const inputRules = [
      RuleDefinitionFactory({
        name: ruleClassName,
        // This is the format expected by App and RuleList components
        properties: Map({
          [propertyName]: RulePropertyDefinitionFactory({ name: propertyName }),
        }),
      }),
    ];
    // The contents of the file that will be imported
    const importedRules = [
      {
        class: ruleClassName, // same name, so it is matched
        selector: 'other',
        properties: {
          [propertyName]: {
            attribute: 'SomeAttribute',
            selector: selector,
          },
        },
      },
    ];

    testImportedFileResult(inputRules, importedRules, component =>
      // Expect to find a text box that is a child of the rule with the selector
      expect(
        component.find(`input[name="${propertyName}"][value="${selector}"]`)
          .length
      ).toBe(1)
    );
  });

  it('should show imported rule property attribute', () => {
    // Randomize the attribute name
    const attributeName = 'SomeAttribute' + Math.random().toString();
    const propertyName = 'SomeProperty';
    const ruleClassName = 'SomeRule';
    const inputRules = [
      RuleDefinitionFactory({
        name: ruleClassName,
        // This is the format expected by App and RuleList components
        properties: Map({
          [propertyName]: RulePropertyDefinitionFactory({ name: propertyName }),
        }),
      }),
    ];
    // The contents of the file that will be imported
    const importedRules = [
      {
        class: ruleClassName, // same name, so it is matched
        properties: {
          [propertyName]: {
            attribute: attributeName,
            selector: 'SomeSelector',
          },
        },
      },
    ];

    testImportedFileResult(inputRules, importedRules, component =>
      // Expect to find a single selected option with the attribute value
      expect(component.find(`option[value="${attributeName}"]`).length).toBe(1)
    );
  });

  it('should export the same imported file', () => {
    const ruleClassName = `SomeClass${Math.random()}`;
    const propertyName = `SomeProperty${Math.random()}`;
    const inputRules = [
      RuleDefinitionFactory({
        name: ruleClassName,
        // This is the format expected by App and RuleList components
        properties: Map({
          [propertyName]: RulePropertyDefinitionFactory({ name: propertyName }),
        }),
      }),
    ];

    RuleDefinitionActions.removeAll();
    inputRules.forEach(rule => RuleDefinitionActions.addRuleDefinition(rule));

    const importedFileObj = {
      ...defaultAttributionInfo,
      rules: [
        ...defaultExportedRules,
        {
          class: ruleClassName,
          selector: `SomeSClassSelector${Math.random()}`,
          properties: {
            [propertyName]: {
              attribute: `SomeAttribute${Math.random()}`,
              selector: `SomePropertySelector${Math.random()}`,
              type: 'string',
            },
          },
        },
      ],
    };

    fs.__setReadFileCallback((filePaths, encoding, callback) => {
      // Whenever we try to read from a file, pass the contents of our object
      callback(null, JSON.stringify(importedFileObj));
    });

    fs.__setWriteFileCallback((fileName, contents, encoding, errorCallback) => {
      // Expected exported object has the same rules we imported
      expect(JSON.parse(contents)).toEqual(importedFileObj);
    });

    const component = mount(<AppContainer />);
    component.find('#import-button').simulate('click');
    component.find('#export-button').simulate('click');
  });

  it('should sort rules definitions by display name', () => {
    const inputRules = [
      RuleDefinitionFactory({
        name: 'Rule1',
        displayName: 'Rule X3 (Expected Third)',
      }),
      RuleDefinitionFactory({
        name: 'Rule2',
        displayName: 'Rule X2 (Expected Second)',
      }),
      RuleDefinitionFactory({
        name: 'Rule3',
        displayName: 'Rule X1 (Expected First)',
      }),
    ];

    RuleDefinitionActions.removeAll();
    inputRules.forEach(rule => RuleDefinitionActions.addRuleDefinition(rule));

    // Mount the app with the input rules above
    const component = mount(<AppContainer />);
    const ruleOptions = component.find(
      'select.rule-selector > optgroup > option'
    );

    expect(ruleOptions.length).toBe(inputRules.length);

    for (let childIndex = 0; childIndex < inputRules.length - 1; childIndex++) {
      expect(
        ruleOptions.at(childIndex).text() <=
          ruleOptions.at(childIndex + 1).text()
      ).toBeTruthy();
    }
  });
});

function simlulateImport(rules) {
  return simulateButtonClick('import-button', rules);
}

function simlulateExport(rules) {
  return simulateButtonClick('export-button', rules);
}

function simulateButtonClick(buttonId, rules) {
  RuleDefinitionActions.removeAll();
  if (rules) {
    rules.forEach(rule => RuleDefinitionActions.addRuleDefinition(rule));
  }

  // Mount the RuleList component
  const component = mount(<AppContainer />);

  // Trigger a click on a button
  // Exptected to trigger our callbacks
  component.find('#' + buttonId).simulate('click');

  // Return the component, which can be inspected
  return component;
}

// Refactored version of all tests that will verify the results if an import
function testImportedFileResult(inputRules, importedRules, expectCallback) {
  // The contents of the file we will import
  const importedFileContents = JSON.stringify({
    rules: importedRules,
  });
  fs.__setReadFileCallback((filePaths, encoding, callback) => {
    // Whenever we try to read from a file, pass the contents of our object
    callback(null, importedFileContents);
  });

  // Mount the component using the input rules and trigger an import
  const component = simlulateImport(inputRules);

  // Trigger the verification callback passing the mounted component
  expectCallback(component);
}
