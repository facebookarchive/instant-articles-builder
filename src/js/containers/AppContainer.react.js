/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const { Container, Store } = require('flux');
const RuleStore = require('../data/RuleStore.js');
const RuleDefinitionStore = require('../data/RuleDefinitionStore.js');
const AppStore = require('../data/AppStore.js');
const App = require('../components/App.react.js');

import type { State as RuleStoreState } from '../data/RuleStore';
import type { State as RuleDefinitionStoreState } from '../data/RuleDefinitionStore';
import type { State as AppStoreState } from '../data/AppStore';

export type Props = {
  rules: RuleStoreState,
  ruleDefinitions: RuleDefinitionStoreState,
  app: AppStoreState
};

function getState(): Props {
  return {
    rules: RuleStore.getState(),
    ruleDefinitions: RuleDefinitionStore.getState(),
    app: AppStore.getState(),
  };
}

function getStores(): Store[] {
  return [RuleStore, RuleDefinitionStore, AppStore];
}

module.exports = Container.createFunctional(App, getStores, getState);
