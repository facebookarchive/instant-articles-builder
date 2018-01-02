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
const debounce = require('../utils/debounce.js');
const homeURL = `file:///${__dirname}/../../html/home.html`;

import RuleUtils from '../utils/RuleUtils';
import EditorActions from '../data/EditorActions';
import RuleActions from '../data/RuleActions';
import type { Attribute } from '../models/Attribute';
import { Map } from 'immutable';
import { AttributeFactory } from '../models/Attribute';
import type { Props } from '../containers/AppContainer.react';

type State = {
  url: string,
  displayURL: string,
  showPreview: boolean,
  progress: number
};

class Browser extends React.Component<Props, State> {
  preview: any;
  webview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      url: homeURL,
      displayURL: '',
      showPreview: true,
      progress: 0,
    };
  }

  receiveMessage = (event: any) => {
    if (event.message == 'attributes') {
      // Attributes retrieved
      const elementAttributes: Map<string, Attribute> = Map(
        event.value.attributes.map(attribute => [
          attribute.name,
          AttributeFactory(attribute),
        ])
      );
      const elementCount = event.value.count;
      EditorActions.found(elementAttributes, elementCount);
    } else if (event.message == 'DOM') {
      // Selector retrieved
      const selector = event.value.resolvedCssSelector;
      EditorActions.stopFinding();
      if (this.props.editor.focusedField != null) {
        let field = this.props.editor.focusedField;
        RuleActions.editField(field.set('selector', selector));
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

  syncURL = (e: any) => {
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

  previewLoading = () => {
    this.preview.classList.add('loading');
  };
  previewFinishedLoading = () => {
    this.preview.classList.remove('loading');
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
    this.setState({ url: url });
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

  highlightElements = () => {
    // Uncomment to debug the injected script
    // this.webview.openDevTools();
    if (this.props.editor.focusedField != null) {
      let findMultipleElements = !this.props.editor.focusedField.definition
        .unique;
      let selector = this.props.editor.focusedField.selector;

      if (!this.props.editor.finding) {
        this.webview.send('message', {
          method: 'highlightElements',
          selector: selector,
          multiple: findMultipleElements,
        });
      } else {
        this.webview.send('message', {
          method: 'selectElement',
          multiple: findMultipleElements,
        });
      }
    } else {
      this.webview.send('message', {
        method: 'clear',
      });
    }
  };

  renderPreview = debounce(() => {
    if (this.preview != null) {
      let newURL =
        'view-source:http://127.0.0.1:8105/index.php?url=' +
        encodeURIComponent(this.state.displayURL) +
        '&rules=' +
        encodeURIComponent(JSON.stringify(RuleUtils.export(this.props.rules))) +
        '&timestamp=' +
        performance.now();
      if (this.preview && this.preview.src != newURL) {
        this.preview.src = newURL;
      }
    }
  }, 1000);

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.editor.focusedField != this.props.editor.focusedField ||
      prevProps.editor.finding != this.props.editor.finding
    ) {
      this.highlightElements();
    }

    if (!this.props.rules.equals(prevProps.rules)) {
      this.renderPreview();
    }
  }

  componentDidMount() {
    if (this.webview) {
      let webview = this.webview;
      this.webview.addEventListener('did-finish-load', function() {
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
      this.webview.addEventListener('did-navigate', this.renderPreview);
      this.webview.addEventListener('did-navigate', this.syncURL);
      this.webview.addEventListener(
        'did-get-response-details',
        this.getResponseDetails
      );
      this.webview.addEventListener('dom-ready', this.highlightElements);
      this.webview.addEventListener('dom-ready', this.resetProgress);
      this.webview.addEventListener('error', console.log.bind(console));
      this.webview.addEventListener(
        'ipc-message',
        event => this.receiveMessage(event.args[0]),
        false
      );
      this.preview.addEventListener('did-start-loading', this.previewLoading);
      this.preview.addEventListener(
        'did-stop-loading',
        this.previewFinishedLoading
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
            placeholder="about:home"
            value={this.displayURL()}
            onChange={this.urlTyped}
          />
          <button className="button load" onClick={this.go}>
            Go!
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
            src={this.state.url}
            preload="../js/injected.js"
          />
          <div className="tab" onClick={this.togglePreview}>
            <span>{this.state.showPreview ? '>' : '<'}</span>
          </div>
          <webview
            ref={preview => {
              if (preview) {
                (preview: any).nodeintegration = true;
                this.preview = preview;
              }
            }}
            className={this.state.showPreview ? '' : 'hidden'}
            id="preview"
          />
        </div>
      </div>
    );
  }
}

module.exports = Browser;
