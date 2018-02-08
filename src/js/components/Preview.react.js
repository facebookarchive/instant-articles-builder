/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';

import classNames from 'classnames';
import RuleExporter from '../utils/RuleExporter';
import type { BaseProps } from '../containers/AppContainer.react';
import { Loader, Dimmer, Form, Tab } from 'semantic-ui-react';

type Props = BaseProps & { url: string, hidden: boolean };
type State = {
  previewLoading: boolean,
  sourceLoading: boolean
};

class Preview extends React.Component<Props, State> {
  preview: any;
  sourceview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      previewLoading: false,
      sourceLoading: false,
    };
  }

  previewLoading = () => {
    this.setState({ previewLoading: true });
  };
  previewFinishedLoading = () => {
    this.setState({ previewLoading: false });
  };

  sourceLoading = () => {
    this.setState({ sourceLoading: true });
  };
  sourceFinishedLoading = () => {
    this.setState({ sourceLoading: false });
  };

  sourceSrc = () => {
    return (
      'view-source:http://127.0.0.1:8105/index.php?url=' +
      encodeURIComponent(this.props.url) +
      '&rules=' +
      encodeURIComponent(
        JSON.stringify(RuleExporter.export(this.props.rules))
      ) +
      '&preview=false'
    );
  };
  previewSrc = () => {
    return (
      'http://127.0.0.1:8105/index.php?url=' +
      encodeURIComponent(this.props.url) +
      '&rules=' +
      encodeURIComponent(
        JSON.stringify(RuleExporter.export(this.props.rules))
      ) +
      '&preview=true'
    );
  };

  render() {
    return (
      <div
        className={classNames({
          preview: true,
          hidden: this.props.hidden,
        })}
      >
        <Form className="grow">
          <Form.Field className="grow">
            <Tab
              className="grow"
              panes={[
                {
                  menuItem: 'Preview',
                  render: () => {
                    const webview = (
                      <webview
                        id="preview"
                        src={this.previewSrc()}
                        ref={webview => {
                          if (webview) {
                            (webview: any).addEventListener(
                              'did-start-loading',
                              this.previewLoading
                            );
                            (webview: any).addEventListener(
                              'did-stop-loading',
                              this.previewFinishedLoading
                            );
                          }
                        }}
                      />
                    );
                    return (
                      <Tab.Pane key="preview" className="grow">
                        <Dimmer inverted active={this.state.previewLoading}>
                          <Loader />
                        </Dimmer>
                        {webview}
                      </Tab.Pane>
                    );
                  },
                },
                {
                  menuItem: 'Source',
                  render: () => {
                    const webview = (
                      <webview
                        id="source"
                        src={this.sourceSrc()}
                        ref={webview => {
                          if (webview) {
                            (webview: any).addEventListener(
                              'did-start-loading',
                              this.previewLoading
                            );
                            (webview: any).addEventListener(
                              'did-stop-loading',
                              this.previewFinishedLoading
                            );
                          }
                        }}
                      />
                    );
                    return (
                      <Tab.Pane key="preview" className="grow">
                        <Dimmer inverted active={this.state.sourceLoading}>
                          <Loader />
                        </Dimmer>
                        {webview}
                      </Tab.Pane>
                    );
                  },
                },
              ]}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}

module.exports = Preview;
