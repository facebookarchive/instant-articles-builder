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
const RuleList = require('./RuleList.react.js');
const EditorActions = require('../data/EditorActions');

import Browser from './Browser.react';
import type { Props } from '../containers/AppContainer.react';
import { NUX } from './NUX.react';
import NUXTour from './NUXTour.react';
import { BugReporter } from './BugReporter.react';
import UpdateNotice from './UpdateNotice.react';

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  // Handle escaping selection on pressing ESC
  componentDidMount() {
    document.addEventListener('keyup', this.cancelOnEscape);
    document.addEventListener('click', this.blurOnClickOut);
  }
  componentWillUnmount() {
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
        <NUXTour {...this.props} />
        <header>
          <div className="header-buttons">
            <NUX {...this.props} />
            <BugReporter {...this.props} />
          </div>
          <img src="../img/icon-nobg.svg" width="48" height="48" />
          <h1>
            <span className="ia">Instant Articles</span>{' '}
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
        <UpdateNotice {...this.props} />
      </div>
    );
  }
}

module.exports = App;
