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
import { Message, Icon, Transition } from 'semantic-ui-react';
import type { Props } from '../containers/AppContainer.react';
import { version } from '../version';
import { shell } from 'electron';

const compareVersions = require('compare-versions');
const octokit = require('@octokit/rest')();

const repository = {
  owner: 'facebook',
  repo: 'facebook-instant-articles-rules-editor',
};

type State = {
  releaseURL: ?string,
  releaseVersion: ?string,
  visible: boolean
};

class UpdateNotice extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      releaseURL: null,
      releaseVersion: null,
      visible: false,
    };
  }

  componentDidMount = () => {
    this.fetchVersion();
  };

  handleDismiss = () => {
    this.setState({
      visible: false,
    });
  };

  fetchVersion = () => {
    octokit.repos.getLatestRelease(repository, (error, result) => {
      if (result == null || result['data'] == null) {
        return;
      }
      const data = result['data'];
      const releaseURL = data['html_url'];
      const releaseVersion = data['tag_name'];

      if (releaseURL != null && releaseVersion != null) {
        this.setState({
          releaseURL,
          releaseVersion,
          visible: compareVersions(releaseVersion, version) > 0,
        });
      }
    });
  };

  render() {
    return (
      <Transition.Group animation="slide up" duration={500}>
        {this.state.visible && (
          <Message
            warning
            attached="bottom"
            onDismiss={this.handleDismiss}
            className="update-notice"
          >
            <center>
              <a
                onClick={() => shell.openExternal(this.state.releaseURL)}
                tabIndex="0"
                role="button"
              >
                <Icon name="download" />
                A new version ({this.state.releaseVersion}) is available, click
                here to download it.
              </a>
            </center>
          </Message>
        )}
      </Transition.Group>
    );
  }
}

export default UpdateNotice;
