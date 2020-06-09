/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { shell } from 'electron';
import React from 'react';
import { Button, Checkbox, Icon, Modal, Image } from 'semantic-ui-react';
import type { Props } from '../containers/AppContainer.react';
import settings from 'electron-settings';
import EditorActions from '../data/EditorActions';

type State = { modalOpen: boolean, skip: boolean };

export const helpURL =
  'https://developers.facebook.com/docs/instant-articles/rules-editor';

export class NUX extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: !settings.get('nux.skip'),
      skip: settings.get('nux.skip'),
    };
  }

  handleSkipChange = (event: Event, data: { checked: boolean }) => {
    this.setState({ skip: data.checked });
    settings.set('nux', { skip: data.checked });
  };

  handleClose = () => this.setState({ modalOpen: false });

  handleOpen = () => this.setState({ modalOpen: true });

  handleTakeTour = () => {
    this.setState({ modalOpen: false });
    EditorActions.startTour();
  };

  render() {
    return (
      <Modal
        trigger={
          <Button
            icon
            className="nux-open"
            onClick={this.handleOpen}
            color="facebook"
          >
            <Icon name="help circle" /> Help
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        dimmer="blurring"
        size="small"
        closeOnDimmerClick={false}
        className="nux-modal"
      >
        <Modal.Header className="nux-header">
          <Image src="../img/icon-nobg.svg" size="mini" floated="left" />{' '}
          Welcome to the Instant Articles Builder
        </Modal.Header>
        <Modal.Content>
          <p>
            To convert your articles into
            <a target="_blank" href="https://instantarticles.fb.com/">
              {' '}
              Facebook Instant Articles
            </a>
            , you'll need:
          </p>
          <ul>
            <li>A website with articles</li>
            <li>
              A Facebook Page with Instant Articles turned on and connected to
              your website
            </li>
          </ul>
          <p>
            Once you've finished and saved, upload the file to a public URL and
            reference it by adding the following meta tag to the{' '}
            <code>&lt;head&gt;</code> tag of your articles:
          </p>
          <p>
            <code>
              &lt;meta property="ia:rules_url"
              content="path/to/your/rules-file.json"/&gt;
            </code>
          </p>
          <p>
            <a
              tabIndex="0"
              role="button"
              onClick={() => shell.openExternal(helpURL)}
            >
              <Icon name="info circle" /> Read our developer docs
            </a>{' '}
            to learn more.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox
            checked={this.state.skip}
            onChange={this.handleSkipChange}
            label="Don't show this again"
            className="nux-checkbox
          "
          />
          <Button onClick={this.handleClose} icon>
            <Icon name="close" /> Close
          </Button>
          <Button
            color="facebook"
            onClick={this.handleTakeTour}
            icon
            labelPosition="right"
          >
            <Icon name="arrow right" /> Take the Tour
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
