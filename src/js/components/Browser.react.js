/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

let React = require('react');
let fs = require('fs');

const homeURL = `file:///${__dirname}/../../html/home.html`;

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.selectElement = this.selectElement.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {
      url: homeURL,
      displayURL: '',
    };
  }

  receiveMessage(event) {
    if (event.message == 'attributes') {
      const attributes = new Map(Object.entries(event.value.attributes));
      this.props.onAttributesReceived(
        event.value.selector,
        attributes,
        event.value.count
      );
    } else if (event.message == 'DOM') {
      this.props.onCssSelectorResolved(event.value.resolvedCssSelector);
    }
  }

  displayURL = url => {
    if (this.state.displayURL.startsWith('file:///')) {
      return '';
    }
    else {
      return this.state.displayURL;
    }
  };

  syncURL = e => {
    this.setState({ displayURL: e.url });
  };

  startProgress = e => {
    this.setState({ progress: 0.15 });
  };

  resetProgress = e => {
    this.setState({ progress: 0 });
  };

  getResponseDetails = e => {
    // this faux progress bar calculation will ensure progress is registered
    // but the progress bar will never be completely full
    this.setState((prevState) => ({
      progress: prevState.progress > 0 ? prevState.progress + (1 - prevState.progress)/10 : 0
    }));
  };

  urlTyped = e => {
    this.setState({ displayURL: e.target.value });
  };

  go = e => {
    let url = this.state.displayURL;
    if (url === 'about:home') {
      url = homeURL;
    }
    else if (!/^https?:\/\//i.test(url)) {
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

  highlightElements = e => {
    let selector = this.props.selector;
    let findMultipleElements = this.props.findMultipleElements;
    let webview = e.target;
    webview.send('message', {
      method: 'highlightElements',
      selector: selector,
      multiple: findMultipleElements,
    });
  };

  selectElement(e) {
    let webview = e.target;
    let findMultipleElements = this.props.findMultipleElements;
    webview.send('message', {
      method: 'selectElement',
      multiple: findMultipleElements,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selector != this.props.selector &&
      nextProps.selector &&
      this.webview
    ) {
      this.webview.send('message', {
        method: 'highlightElements',
        selector: nextProps.selector,
        multiple: nextProps.findMultipleElements,
      });
    } else if (nextProps.findAttribute) {
      this.webview.send('message', {
        method: 'selectElement',
        multiple: nextProps.findMultipleElements,
      });
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
      this.webview.addEventListener('did-get-response-details', this.getResponseDetails);
      this.webview.addEventListener('dom-ready', this.highlightElements);
      this.webview.addEventListener('dom-ready', this.resetProgress);
      this.webview.addEventListener('did-navigate', this.syncURL);
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
            placeholder="about:home"
            value={this.displayURL()}
            onChange={this.urlTyped}
          />
          <button className="button load" onClick={this.go}>
            Go!
          </button>
        </form>
        <progress value={this.state.progress}></progress>
        <webview
          ref={webview => {
            if (webview) {
              webview.nodeintegration = true;
              this.webview = webview;
            }
          }}
          id="foo"
          src={this.state.url}
          preload="../js/injected.js"
        />
      </div>
    );
  }
}

module.exports = Browser;
