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
const EditorActions = require('../data/EditorActions');

import type { Props } from '../containers/AppContainer.react';

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  // Handle escaping selection on pressing ESC
  componentDidMount() {
    document.addEventListener('keyup', this.cancelOnEscape);
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.cancelOnEscape);
  }
  cancelOnEscape = (e: Event) => {
    // Handle element selection cancelation on 'esc' press
    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      EditorActions.stopFinding();
    }
  };

  render() {
    return (
      <div id="wrapper">
        <header>
          <img src="../img/logo-48.png" />
          <h1>Rules Editor</h1>
        </header>
        <div id="content-wrapper">
          <main id="content">
            <Browser {...this.props} />
          </main>
          <nav id="nav">
            <RuleList {...this.props} />
          </nav>
        </div>
      </div>
    );
  }
}

module.exports = App;
