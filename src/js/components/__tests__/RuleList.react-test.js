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
const RuleList = require('../RuleList.react.js');

// Rules that are always included in the exported file
const defaultExportedRules = [
  {
    class: 'TextNodeRule',
  },
  {
    class: 'PassThroughRule',
    selector: '*',
  },
];

// Initialize Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

describe('RuleList', () => {
  it('should export only default rules', () => {
    // Set this function as the one that will be called as fs.writeFile
    fs.__setWriteFileCallback((fileName, contents, errorCallback) => {
      // Expected exported object has onle the default rules
      const expectedRules = {
        rules: [...defaultExportedRules],
      };
      expect(JSON.parse(contents)).toEqual(expectedRules);
    });

    // Mount the App component and trigger a click on the Export button
    // Exptected to trigger our writeFile callback
    mount(<RuleList onRulesJSONChanged={() => {}} rules={[]} />)
      .find('#export-button')
      .simulate('click');
  });
});
