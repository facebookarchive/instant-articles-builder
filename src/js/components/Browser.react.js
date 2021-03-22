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
const fs = require('fs');
const path = require('path');

import { Map } from 'immutable';
import EditorActions from '../data/EditorActions';
import RuleActions from '../data/RuleActions';
import type { Props } from '../containers/AppContainer.react';
import type { BrowserMessage } from '../models/BrowserMessage';
import { BrowserMessageTypes } from '../models/BrowserMessage';
import Preview from './Preview.react';
import { homeURL } from '../models/Editor';
import { RuleUtils } from '../utils/RuleUtils';

type State = {
  displayURL: string,
  showPreview: boolean,
  progress: number,
};

class Browser extends React.Component<Props, State> {
  preview: any;
  webview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      displayURL: '',
      showPreview: true,
      progress: 0,
    };
  }

  receiveMessage = (message: BrowserMessage) => {
    if (message.type === BrowserMessageTypes.ATTRIBUTES_RETRIEVED) {
      const attributesMap = Map(
        message.attributes.reduce((map, attr) => {
          map[attr.name] = attr;
          return map;
        }, {})
      );
      EditorActions.found(attributesMap, message.count);
    }
    if (message.type === BrowserMessageTypes.ELEMENT_SELECTED) {
      EditorActions.stopFinding();
      if (this.props.editor.focusedField != null) {
        let field = this.props.editor.focusedField;
        RuleActions.editField(
          field.set('selector', message.selectors[0] || '')
        );
      }
    }
  };

  displayURL = (): string => {
    if (this.state.displayURL.startsWith('file:///')) {
      return '';
    } else {
      return this.state.displayURL;
    }
  };

  togglePreview = () => {
    this.setState(prevState => ({ showPreview: !prevState.showPreview }));
  };

  syncURL = (e: { url: string }) => {
    EditorActions.loadURL(e.url);
    this.setState({ displayURL: e.url });
  };

  startProgress = () => {
    this.setState({ progress: 0.15 });
  };

  resetProgress = () => {
    this.setState({ progress: 0 });
  };

  getResponseDetails = () => {
    // this faux progress bar calculation will ensure progress is registered
    // but the progress bar will never be completely full
    this.setState(prevState => ({
      progress:
        prevState.progress > 0
          ? prevState.progress + (1 - prevState.progress) / 10
          : 0,
    }));
  };

  urlTyped = (e: any) => {
    this.setState({ displayURL: e.target.value });
  };

  go = (e: Event) => {
    let url = this.state.displayURL;
    if (url === 'about:home') {
      url = homeURL;
    } else if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    EditorActions.loadURL(url);
    this.webview.focus();
    e.preventDefault();
    return false;
  };

  goBack = () => {
    if (this.webview) {
      this.webview.goBack();
    }
  };

  goForward = () => {
    if (this.webview) {
      this.webview.goForward();
    }
  };

  canGoBack = () => {
    if (this.webview) {
      return this.webview.canGoBack();
    }
    return false;
  };

  canGoForward = () => {
    if (this.webview) {
      return this.webview.canGoForward();
    }
    return false;
  };

  getPassThroughSelectors = () => {
    const selectors = [];
    for (let rule of this.props.rules.valueSeq()) {
      if (
        rule.definition.name == 'PassThroughRule' &&
        RuleUtils.isValid(rule)
      ) {
        selectors.push(rule.selector);
      }
    }
    return selectors;
  };

  highlightElements = () => {
    if (this.props.editor.focusedField != null) {
      let field = this.props.editor.focusedField;
      let fieldName = null;
      let findMultipleElements = !field.definition.unique;
      let selector = field.selector;
      let context = field.definition.getSelectionContext(
        field,
        this.props.rules
      );
      let passThroughSelectors = this.getPassThroughSelectors();
      if (field.fieldType === 'Rule') {
        fieldName = `${field.definition.name}.selector`;
      } else if (field.fieldType === 'RuleProperty') {
        let rule = field.rule;
        if (rule != null) {
          fieldName = `${rule.definition.name}.${field.definition.name}`;
        }
      }

      if (this.props.editor.finding) {
        this.webview.send('message', {
          type: BrowserMessageTypes.SELECT_ELEMENT,
          selector: context,
          passThroughSelectors: passThroughSelectors,
          multiple: findMultipleElements,
          fieldName: fieldName,
        });
      } else {
        this.webview.send('message', {
          type: BrowserMessageTypes.HIGHLIGHT_ELEMENT,
          selector: selector,
          contextSelector: context,
        });
        this.webview.send('message', {
          type: BrowserMessageTypes.FETCH_ATTRIBUTES,
          selector: selector,
          contextSelector: context,
        });
      }
    }
  };

  highlightWarningElements = () => {
    if (this.props.editor.warningSelector !== null) {
      this.webview.send('message', {
        type: BrowserMessageTypes.HIGHLIGHT_WARNING_ELEMENTS,
        selector: this.props.editor.warningSelector,
      });
      this.webview.send('message', {
        type: BrowserMessageTypes.FETCH_ATTRIBUTES,
        selector: this.props.editor.warningSelector,
        contextSelector: 'html',
      });
    }
  };

  clearHighlightElements = () => {
    if (
      this.props.editor.warningSelector === null &&
      this.props.editor.focusedField == null
    ) {
      this.webview.send('message', {
        type: BrowserMessageTypes.CLEAR_HIGHLIGHTS,
      });
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    let highlighted = false;
    if (
      JSON.stringify(prevProps.editor.focusedField) !=
        JSON.stringify(this.props.editor.focusedField) ||
      prevProps.editor.finding != this.props.editor.finding
    ) {
      highlighted = true;
      this.highlightElements();
    }
    if (prevProps.editor.warningSelector != this.props.editor.warningSelector) {
      highlighted = true;
      this.highlightWarningElements();
    }
    if (highlighted) {
      this.clearHighlightElements();
    }
  }

  componentDidMount() {
    if (this.webview) {
      let webview = this.webview;
      this.webview.addEventListener('dom-ready', function() {
        fs.readFile(__dirname + '/../../css/injected.css', 'utf-8', function(
          error,
          data
        ) {
          var formatedData = data.replace(/\s{2,10}/g, ' ').trim();
          webview.insertCSS(formatedData);
        });
      });
      this.webview.addEventListener('did-start-loading', this.startProgress);
      this.webview.addEventListener('did-stop-loading', this.resetProgress);
      this.webview.addEventListener('did-navigate', this.startProgress);
      //this.webview.addEventListener('did-navigate', this.renderPreview);
      this.webview.addEventListener('did-navigate', this.syncURL);
      this.webview.addEventListener(
        'did-get-response-details',
        this.getResponseDetails
      );
      this.webview.addEventListener('dom-ready', this.highlightElements);
      this.webview.addEventListener('dom-ready', this.resetProgress);
      // eslint-disable-next-line no-console
      this.webview.addEventListener('error', console.log.bind(console));
      this.webview.addEventListener(
        'ipc-message',
        event => this.receiveMessage(event.args[0]),
        false
      );
    }
  }

  render() {
    return (
      <div className="browser">
        <form className="loader" onSubmit={this.go}>
          <button className="button navigation" onClick={this.goBack}>
            &lt;
          </button>
          <button className="button navigation" onClick={this.goForward}>
            &gt;
          </button>
          <input
            className="address"
            type="text"
            name="url"
            placeholder="Enter the URL of an article on your website"
            value={this.displayURL()}
            onChange={this.urlTyped}
          />
          <button className="button load" onClick={this.go}>
            Go
          </button>
        </form>
        <progress value={this.state.progress} />
        <div className="webviews">
          <webview
            ref={webview => {
              if (webview) {
                (webview: any).nodeintegration = true;
                this.webview = webview;
              }
            }}
            id="webview"
            src={this.props.editor.url}
            preload={path.join(__dirname, '../injected.js')}
            webpreferences="sandbox=yes, nodeIntegration=no, contextIsolation=yes"
          />
          <div className="tab" role="presentation" onClick={this.togglePreview}>
            <span>{this.state.showPreview ? '>' : '<'}</span>
          </div>
          <Preview {...this.props} hidden={!this.state.showPreview} />
        </div>
      </div>
    );
  }
}

module.exports = Browser;
