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
    document.addEventListener('click', this.blurOnClickOut);
  }
  componentDidUnmount() {
    document.removeEventListener('keyup', this.cancelOnEscape);
    document.removeEventListener('click', this.blurOnClickOut);
  }
  cancelOnEscape = (e: Event) => {
    // Handle element selection cancelation on 'esc' press
    // escape key maps to keycode `27`
    if (e.keyCode == 27) {
      if (this.props.editor.get('finding')) {
        EditorActions.stopFinding();
      } else {
        EditorActions.blur();
      }
    }
  };
  blurOnClickOut = (e: Event) => {
    // Handle blur on clicking out of any form
    if (
      e.target instanceof HTMLElement &&
      !e.target.matches('.selectors-form *')
    ) {
      EditorActions.blur();
    }
  };

  render() {
    return (
      <div id="wrapper">
        <header>
          <img src="../img/logo-48.png" />
          <h1>
            <span className="fb">Facebook</span> Instant Articles |{' '}
            <span className="app-name">Rules Editor</span>
          </h1>
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
