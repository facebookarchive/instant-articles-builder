/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

let React = require('react');
let fs = require('fs');

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.selectElement = this.selectElement.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {
      url: 'http://www.diegoquinteiro.com/nascido-em-4-de-julho/',
      displayURL: 'http://www.diegoquinteiro.com/nascido-em-4-de-julho/',
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

  loadStart = e => {
    this.setState({ displayURL: e.target.src });
  };

  urlTyped = e => {
    this.setState({ displayURL: e.target.value });
  };

  go = () => {
    this.setState({ url: this.state.displayURL });
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
      this.webview.addEventListener('did-finish-load', this.highlightElements);
      this.webview.addEventListener('did-start-loading', this.loadStart);
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
        <div className="loader">
          <input
            className="address"
            type="text"
            name="url"
            placeholder="http://..."
            value={this.state.displayURL}
            onChange={this.urlTyped}
          />
          <button className="button load" onClick={this.go}>
            Go!
          </button>
        </div>
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
