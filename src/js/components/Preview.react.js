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

import webserver from '../utils/preview-webserver';
import { BrowserWindow } from 'electron';

type Props = BaseProps & { hidden: boolean };

type State = {
  previewLoading: boolean,
  sourceLoading: boolean,
  activeTab: number,
  activeTab: number,
  warnings: string[],
  previewHtml: ?string,
  sourceHtml: ?string,
};

class Preview extends React.Component<Props, State> {
  preview: any;
  sourceview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      previewLoading: false,
      activeTab: 0,
      warnings: [],
      previewHtml: null,
      sourceHtml: null,
    };
  }

  previewLoading = () => {
    console.log('Loading...');
    this.setState({ previewLoading: true });
  };
  previewFinishedLoading = () => {
    console.log('Loaded');
    this.setState({ previewLoading: false });
  };
  previewFailedLoading = (e: any) => {
    console.log('Failed loading', e);
  };

  reloadTabBrowserWindow = (
    tabIndex: number,
    browserWindow: BrowserWindow,
    contentPathname: string,
    viewSource: boolean,
    validateRequiredFields: boolean
  ): void => {
    const url = new URL(webserver.baseUrl);
    url.pathname = contentPathname;

    if (this.state.activeTab == tabIndex && browserWindow != null) {
      if (validateRequiredFields) {
        const generatedRules = RuleExporter.export(
          this.props.rules,
          this.props.settings
        );
        const hasRequiredField = !!(
          generatedRules &&
          generatedRules.rules.find(rule => rule.class === 'GlobalRule')
        );

        if (!hasRequiredField) {
          browserWindow.loadURL(url.href);
          return;
        }
      }

      url.search = `url=${encodeURIComponent(this.props.editor.url)}`;

      const href = (viewSource ? 'view-source:' : '') + url.href;

      browserWindow.loadURL(href, {
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
      });
    }
  };

  reloadPreview = debounce(() => {
    this.reloadTabBrowserWindow(0, this.preview, 'preview.php', false, true);
  }, 1000);

  reloadSource = debounce(() => {
    this.reloadTabBrowserWindow(1, this.sourceview, 'source.php', true, false);
  reloadArticle = debounce(() => {
    this.previewLoading();

    const url =
      'http://127.0.0.1:8105/article.php?url=' +
      encodeURIComponent(this.props.editor.url);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = xhr.response;
        if (response) {
          const warnings = response.warnings ? response.warnings : [];
          this.setState({
            warnings: response.warnings,
            sourceHtml: response.source,
            previewHtml: response.amp,
          });
        }
        this.previewFinishedLoading();
      }
    };

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    const params =
      'rules=' +
      encodeURIComponent(
        JSON.stringify(
          RuleExporter.export(this.props.rules, this.props.settings)
        )
      );
    xhr.send(params);
  }, 1000);

  reloadPreview = debounce(() => {
    const url = 'view-source:http://127.0.0.1:8105/echo.php';
    this.reloadWebview(this.preview, url, this.state.previewHtml);
  }, 1000);

  reloadSource = debounce(() => {
    const url = 'view-source:http://127.0.0.1:8105/echo.php';
    this.reloadWebview(this.sourceview, url, this.state.sourceHtml);
  }, 1000);

  reloadWebview = (webview: any, url: string, markup: ?string) => {
    if (!webview) {
      return;
    }

    webview.loadURL(url, {
      postData: [
        {
          type: 'rawData',
          bytes: Buffer.from(
            'markup=' + encodeURIComponent(markup ? markup : '')
          ),
        },
      ],
      extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
    });
  };

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
      console.log('Should reload');
      this.reloadArticle();
    }
  }

  handleTabChange = (event: any, data: any) => {
    this.setState({ activeTab: data.activeIndex });
    if (data.activeIndex == 0) {
      this.reloadPreview();
    } else if (data.activeIndex == 1) {
      this.reloadSource();
    } else if (data.activeIndex == 2) {
      // this.reloadWarnings();
    }
  };

  getWebviewTabPane(
    tabName: string,
    tabKey: string,
    refAssignmentFunc: any => void
  ) {
    return {
      menuItem: tabName,
      render: () => {
        const webview = (
          <webview
            id={tabKey}
            src="about:blank"
            ref={webview => {
              if (webview) {
                refAssignmentFunc(webview);
                (webview: any).addEventListener(
                  'did-start-loading',
                  this.previewLoading
                );
                (webview: any).addEventListener(
                  'did-stop-loading',
                  this.previewFinishedLoading
                );
                (webview: any).addEventListener(
                  'did-fail-loading',
                  this.previewFailedLoading
                );
              }
            }}
          />
        );
        return (
          <Tab.Pane key={tabKey} className="grow">
            <Dimmer inverted active={this.state.previewLoading}>
              <Loader />
            </Dimmer>
            {webview}
          </Tab.Pane>
        );
      },
    };
  }

  getTabPanes() {
    const previewPane = this.getWebviewTabPane(
      'Preview',
      'preview',
      webview => (this.preview = webview)
    );
    const sourcePane = this.getWebviewTabPane(
      'Source',
      'source',
      webview => (this.sourceview = webview)
    );

    const warningsPane = {
      menuItem: 'Warnings',
      render: () => (
        <Tab.Pane key="warnings" className="grow">
          <Dimmer inverted active={this.state.previewLoading}>
            <Loader />
          </Dimmer>
          <div>
            <ul>
              {this.state.warnings.map(warning => (
                <li>{warning}</li>
              ))}
            </ul>
          </div>
        </Tab.Pane>
      ),
    };

    return [previewPane, sourcePane, warningsPane];
  }

  render() {
    const tabPanes = this.getTabPanes();

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
              onTabChange={this.handleTabChange}
              panes={tabPanes}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}

module.exports = Preview;
