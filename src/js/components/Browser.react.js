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

import { Map } from 'immutable';
import RuleExporter from '../utils/RuleExporter';
import EditorActions from '../data/EditorActions';
import RuleActions from '../data/RuleActions';
import type { Props } from '../containers/AppContainer.react';
import type { BrowserMessage } from '../models/BrowserMessage';
import { BrowserMessageTypes } from '../models/BrowserMessage';
import { RuleUtils } from '../models/Rule';

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
      let field = this.props.editor.focusedField;
      let findMultipleElements = !field.definition.unique;
      let selector = field.selector;

      // Calculate context for selecting elements
      let context = 'html';
      if (field.fieldType === 'RuleProperty' && field.rule != null) {
        let ruleGuid = field.rule.guid;
        for (let rule of this.props.rules.valueSeq()) {
          if (rule.guid === ruleGuid) {
            context = rule.selector;
          }
        }
      }
      if (field.fieldType === 'Rule') {
        for (let rule of this.props.rules.valueSeq()) {
          if (
            rule.definition.name === 'GlobalRule' &&
            RuleUtils.isValid(rule)
          ) {
            const selector = rule.properties.getIn([
              'article.body',
              'selector',
            ]);
            if (selector != null && selector != '') {
              context = selector;
            }
          }
        }
      }

      if (this.props.editor.finding) {
        this.webview.send('message', {
          type: BrowserMessageTypes.SELECT_ELEMENT,
          selector: context,
          multiple: findMultipleElements,
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
    } else {
      this.webview.send('message', {
        type: BrowserMessageTypes.CLEAR_HIGHLIGHTS,
      });
    }
  };

  renderPreview = debounce(() => {
    if (this.preview != null) {
      let newURL =
        'view-source:http://127.0.0.1:8105/index.php?url=' +
        encodeURIComponent(this.state.displayURL) +
        '&rules=' +
        encodeURIComponent(
          JSON.stringify(RuleExporter.export(this.props.rules))
        ) +
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
      // eslint-disable-next-line no-console
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
          <div className="tab" role="presentation" onClick={this.togglePreview}>
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
