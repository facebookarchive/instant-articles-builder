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
    this.setState({ skip: !data.checked });
    settings.set('nux', { skip: !data.checked });
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
          Welcome to the Rules Editor
        </Modal.Header>
        <Modal.Content>
          <p>
            <strong>Rules Editor</strong> helps you to create rules that convert
            your articles to
            <a target="_blank" href="https://instantarticles.fb.com/">
              {' '}
              Facebok Instant Articles
            </a>.
          </p>
          <p>For using this tool you'll need:</p>
          <ul>
            <li>A website containing articles.</li>
            <li>
              A Facebook Page enabled to use Instant Articles and connected to
              your website.
            </li>
          </ul>
          <p>
            The <abbr title="JavaScript Object Notation">JSON</abbr> file
            produced by this tool should be uploaded to a public URL and
            referenced by a meta tag inside the <code>&lt;head&gt;</code> tag of
            your articles:
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
              <Icon name="info circle" /> Read the full documentation to learn
              more.
            </a>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Checkbox
            checked={!this.state.skip}
            onChange={this.handleSkipChange}
            label="Show on startup"
            className="nux-checkbox
          "
          />
          <Button onClick={this.handleClose} icon>
            <Icon name="close" /> Dismiss
          </Button>
          <Button
            color="facebook"
            onClick={this.handleTakeTour}
            icon
            labelPosition="right"
          >
            <Icon name="arrow right" /> Take a tour
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
