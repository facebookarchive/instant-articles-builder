/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

let App = require('./components/App.react.js');
let ReactDOM = require('react-dom');
let React = require('react');

const InputRules = require('./global-rules-input.js');

document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');

  let rules = [];
  InputRules.rules.forEach(inputRule => {
    let properties = [];
    if (inputRule.properties) {
      Object.entries(inputRule.properties).forEach(
        ([propertyName, propertySettings]) => {
          properties.push({
            ...propertySettings,
            name: propertyName,
          });
        }
      );
    }

    const rule = {
      ...inputRule,
      properties: properties,
    };
    rules.push(rule);
  });

  ReactDOM.render(<App rules={rules} />, root);
});
