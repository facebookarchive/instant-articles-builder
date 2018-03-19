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
import debounce from '../utils/debounce';

type Props = BaseProps & { hidden: boolean };

type State = {
  previewLoading: boolean,
  sourceLoading: boolean,
  activeTab: number
};

class Preview extends React.Component<Props, State> {
  preview: any;
  sourceview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      previewLoading: false,
      sourceLoading: false,
      activeTab: 0,
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

  reloadPreview = debounce(() => {
    if (this.state.activeTab == 0 && this.preview != null) {
      this.preview.loadURL(
        'http://127.0.0.1:8105/preview.php?url=' +
          encodeURIComponent(this.props.editor.url),
        {
          postData: [
            {
              type: 'rawData',
              bytes: Buffer.from(
                'rules=' +
                  encodeURIComponent(
                    JSON.stringify(
                      RuleExporter.export(this.props.rules, this.props.settings)
                    )
                  )
              ),
            },
          ],
          extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
        }
      );
    }
  }, 1000);

  reloadSource = debounce(() => {
    if (this.state.activeTab == 1 && this.sourceview != null) {
      this.sourceview.loadURL(
        'view-source:http://127.0.0.1:8105/source.php?url=' +
          encodeURIComponent(this.props.editor.url),
        {
          postData: [
            {
              type: 'rawData',
              bytes: Buffer.from(
                'rules=' +
                  encodeURIComponent(
                    JSON.stringify(
                      RuleExporter.export(this.props.rules, this.props.settings)
                    )
                  )
              ),
            },
          ],
          extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
        }
      );
    }
  }, 1000);

  shouldReload = (nextProps: Props): boolean => {
    if (nextProps.editor.url != this.props.editor.url) {
      return true;
    }
    if (
      RuleExporter.export(nextProps.rules, nextProps.settings) !=
      RuleExporter.export(this.props.rules, this.props.settings)
    ) {
      return true;
    }
    return false;
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.shouldReload(nextProps)) {
      this.reloadPreview();
      this.reloadSource();
    }
  }

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
              onTabChange={(event, data) => {
                this.setState({ activeTab: data.activeIndex });
                if (data.activeIndex == 0) {
                  this.previewLoading();
                  this.reloadPreview();
                }
                if (data.activeIndex == 1) {
                  this.sourceLoading();
                  this.reloadSource();
                }
              }}
              panes={[
                {
                  menuItem: 'Preview',
                  render: () => {
                    const webview = (
                      <webview
                        id="preview"
                        src="about:blank"
                        ref={webview => {
                          if (webview) {
                            this.preview = webview;
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
                        src="about:blank"
                        ref={webview => {
                          if (webview) {
                            this.sourceview = webview;
                            (webview: any).addEventListener(
                              'did-start-loading',
                              this.sourceLoading
                            );
                            (webview: any).addEventListener(
                              'did-stop-loading',
                              this.sourceFinishedLoading
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
