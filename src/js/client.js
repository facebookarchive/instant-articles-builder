/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

let App = require('./components/App.react.js');
let ReactDOM = require('react-dom');
let React = require('react');

const InputRules = require('./global-rules-input.js');

import type { InputRule } from './types/InputRule';

document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Could not find root element');
    return;
  }

  const rulesByClassName: Map<string, InputRule> = new Map();
  InputRules.rules.forEach(inputRule => {
    if (rulesByClassName.has(inputRule.class)) {
      console.warn(`Duplicate rule '${inputRule.class}' found`);
      return;
    }

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
    rulesByClassName.set(inputRule.class, rule);
  });

  ReactDOM.render(<App rulesByClassName={rulesByClassName} />, root);
});
