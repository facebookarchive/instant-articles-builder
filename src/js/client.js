/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const AppContainer = require('./containers/AppContainer.react');
const ReactDOM = require('react-dom');
const React = require('react');
const RuleDefinitionActions = require('./data/RuleDefinitionActions');
const ruleDefinitions = require('./rule-definitions');

// Register all rule definitions on the store
ruleDefinitions.map(ruleDefinition =>
  RuleDefinitionActions.addRuleDefinition(ruleDefinition)
);

document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Could not find root element');
    return;
  }

  ReactDOM.render(<AppContainer />, root);
});
