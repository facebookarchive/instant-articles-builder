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
const { Container, Store } = require('flux/utils');
const RuleStore = require('../data/RuleStore.js');
const RuleDefinitionStore = require('../data/RuleDefinitionStore.js');
const EditorStore = require('../data/EditorStore.js');
const App = require('../components/App.react.js');

import type { State as RuleStoreState } from '../data/RuleStore';
import type { State as RuleDefinitionStoreState } from '../data/RuleDefinitionStore';
import type { Editor } from '../models/Editor';

export type Props = {
  rules: RuleStoreState,
  ruleDefinitions: RuleDefinitionStoreState,
  editor: Editor
};

function AppContainer(props: Props) {
  return <App {...props} />;
}

/**
 * The State of the container becomes the Props of
 * the views.
 */
function getState(): Props {
  return {
    rules: RuleStore.getState(),
    ruleDefinitions: RuleDefinitionStore.getState(),
    editor: EditorStore.getState(),
  };
}

function getStores(): Store[] {
  return [RuleStore, RuleDefinitionStore, EditorStore];
}

module.exports = Container.createFunctional(AppContainer, getStores, getState);
