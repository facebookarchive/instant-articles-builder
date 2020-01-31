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

const PREVIEW_TAB_INDEX = 0;
const SOURCE_TAB_INDEX = 1;
const WARNING_TAB_INDEX = 2;

type Props = BaseProps & { hidden: boolean };

type State = {
  previewLoading: boolean,
  activeTab: number,
  warnings: string[],
  previewHtml: ?string,
  sourceHtml: ?string,
  errorHtml: ?string,
};

class Preview extends React.Component<Props, State> {
  preview: any;
  sourceview: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      previewLoading: false,
      activeTab: PREVIEW_TAB_INDEX,
      warnings: [],
      previewHtml: null,
      // sourceHtml: null,
      errorHtml: null,
    };
  }

  previewLoading = () => {
    this.setState({ previewLoading: true });
  };
  previewFinishedLoading = () => {
    this.setState({ previewLoading: false });
  };

  getWSURL = (pathname: string) => {
    const url = new URL(webserver.baseUrl);
    url.pathname = pathname;
    url.search = `url=${encodeURIComponent(this.props.editor.url)}`;
    return url;
  };

  getWSURLParams = () => {
    return (
      'rules=' +
      encodeURIComponent(
        JSON.stringify(
          RuleExporter.export(this.props.rules, this.props.settings)
        )
      )
    );
  };

  reloadTabBrowserWindow = (
    tabIndex: number,
    browserWindow: BrowserWindow,
    contentPathname: ?string,
    viewSource: boolean,
    contentHtml: ?string
  ): void => {
    if (this.state.activeTab == tabIndex && browserWindow != null) {
      if (contentPathname && viewSource) {
        const url = this.getWSURL(contentPathname);
        const href = (viewSource ? 'view-source:' : '') + url.href;
        browserWindow.loadURL(href, {
          postData: [
            {
              type: 'rawData',
              bytes: Buffer.from(this.getWSURLParams()),
            },
          ],
          extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
        });
      } else {
        if (contentHtml) {
          browserWindow.loadURL(
            `data:text/html;charset=utf-8,${encodeURIComponent(contentHtml)}`
          );
        }
      }
    }
  };

  reloadPreview = debounce(() => {
    this.reloadTabBrowserWindow(
      PREVIEW_TAB_INDEX,
      this.preview,
      null,
      false,
      this.state.previewHtml || this.state.errorHtml
    );
  }, 1000);

  reloadSource = debounce(() => {
    this.reloadTabBrowserWindow(
      SOURCE_TAB_INDEX,
      this.sourceview,
      'source.php',
      true
    );
  }, 1000);

  loadArticle = debounce(() => {
    this.previewLoading();
    const url = this.getWSURL('article.php');
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = xhr.response;
        if (response) {
          const warnings = response.warnings || [];
          this.setState({
            previewHtml: response.amp,
            sourceHtml: response.source,
            warnings: warnings,
            errorHtml: response.error,
          });
          this.reloadPreview();
          if (this.state.activeTab === WARNING_TAB_INDEX) {
            this.previewFinishedLoading();
          }
        }
      }
    };
    xhr.open('POST', url.href);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(this.getWSURLParams());
  }, 1000);

  shouldReload = (nextProps: Props): boolean => {
    if (nextProps.editor.url != this.props.editor.url) {
      return true;
    }
    if (
      JSON.stringify(
        RuleExporter.export(nextProps.rules, nextProps.settings)
      ) !=
      JSON.stringify(RuleExporter.export(this.props.rules, this.props.settings))
    ) {
      return true;
    }
    return false;
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (this.shouldReload(nextProps)) {
      this.loadArticle();
      this.reloadSource();
    }
  };

  handleTabChange = (event: any, data: any) => {
    this.previewLoading();
    this.setState({ activeTab: data.activeIndex });
    if (data.activeIndex == PREVIEW_TAB_INDEX) {
      this.reloadPreview();
    } else if (data.activeIndex == SOURCE_TAB_INDEX) {
      this.reloadSource();
    } else if (data.activeIndex == WARNING_TAB_INDEX) {
      this.previewFinishedLoading();
    }
  };

  getContentTabPane = (
    tabName: string,
    tabKey: string,
    refAssignmentFunc: any => void,
    content?: any
  ) => {
    return {
      menuItem: tabName,
      render: () => {
        const children = content || (
          <webview
            id={tabKey}
            src="about:blank"
            ref={webview => {
              if (webview) {
                refAssignmentFunc(webview);
                (webview: any).addEventListener(
                  'did-stop-loading',
                  this.previewFinishedLoading
                );
                (webview: any).addEventListener(
                  'did-fail-loading',
                  this.previewFinishedLoading
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
            {children}
          </Tab.Pane>
        );
      },
    };
  };

  getTabPanes = () => {
    const previewPane = this.getContentTabPane(
      'Preview',
      'preview',
      webview => (this.preview = webview)
    );
    const sourcePane = this.getContentTabPane(
      'Source',
      'source',
      webview => (this.sourceview = webview)
    );
    const warningsPane = this.getContentTabPane(
      'Warnings',
      'warnings',
      () => {},
      <div className="warning-tab">
        {this.state.warnings.length > 0 ? (
          <ul>
            {this.state.warnings.map((warning, index) => (
              <li key={`warning-${index}`}>{warning}</li>
            ))}
          </ul>
        ) : (
          <div className="message-container">
            <p className="message">
              No warnings: All fields were successfully connected.
            </p>
          </div>
        )}
      </div>
    );
    return [previewPane, sourcePane, warningsPane];
  };

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
