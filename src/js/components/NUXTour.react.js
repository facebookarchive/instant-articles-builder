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
import { Set } from 'immutable';
import type { Props } from '../containers/AppContainer.react';
import Joyride from 'react-joyride';
import EditorActions from '../data/EditorActions';
import RuleActions from '../data/RuleActions';
import { Icon, Button, Segment } from 'semantic-ui-react';
import { helpURL } from './NUX.react';
import Fs from 'fs';
import RuleExporter from '../utils/RuleExporter';
import RuleCategories from '../models/RuleCategories';
import { shell } from 'electron';

const importExportEncoding = 'utf8';

const tutorialSite =
  'https://media.fb.com/2016/03/07/instant-articles-wordpress-plugin/';

class NUXTour extends React.Component<Props> {
  joyride: ?Joyride = null;

  newConfiguration = () => {
    // Load basic rules
    Fs.readFile(
      'src/js/basic-rules.json',
      importExportEncoding,
      (error, data) => {
        RuleExporter.import(data, this.props.ruleDefinitions);
      }
    );
    // * Disable Filtering
    // EditorActions.filterRules(Set([RuleCategories.BASIC]));
  };

  nextStep = () => {
    if (this.joyride != null) {
      this.joyride.next();
    }
  };

  stop = () => {
    EditorActions.stopTour();
  };

  restart = () => {
    if (this.joyride != null) {
      this.joyride.reset(true);
    }
  };

  buildStepText = (step: {
    content: any,
    nextLabel?: string,
    icon?: string,
    color?: string,
    extraButtons?: any
  }) => {
    return (
      <Segment.Group>
        <Segment>{step.content}</Segment>
        <Segment textAlign="right" secondary>
          {step.extraButtons || (
            <span
              role="button"
              tabIndex="0"
              onClick={this.stop}
              className="cancel-tour"
            >
              <Icon name="close" /> Close
            </span>
          )}
          <Button
            color={step.color || 'facebook'}
            icon
            labelPosition={step.icon != null ? 'left' : 'right'}
            onClick={this.nextStep}
          >
            <Icon name={step.icon || 'arrow right'} />{' '}
            {step.nextLabel || 'Next'}
          </Button>
        </Segment>
      </Segment.Group>
    );
  };

  getSteps = () => {
    const stepStyle = {
      button: {
        display: 'none',
      },
      close: {
        display: 'none',
      },
      back: {
        display: 'none',
      },
    };
    return [
      {
        name: 'new-configuration',
        text: this.buildStepText({
          content: (
            <div>
              <p>Let's create an Instant Article template together.</p>
              <p>We'll use the New button to get started.</p>
            </div>
          ),
        }),
        selector: '.tools button:first-child',
        style: stepStyle,
      },
      {
        name: 'address',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Use the address bar the same way you would in a web browser to
                load a page of your site.
              </p>
              <p>Let's use this sample article.</p>
            </div>
          ),
        }),
        selector: '.loader',
        style: stepStyle,
      },
      {
        name: 'browser',
        text: this.buildStepText({
          content: (
            <div>
              <p>Your article will load in the browser.</p>
            </div>
          ),
        }),
        selector: '.webviews > webview',
        style: stepStyle,
      },
      {
        name: 'tools',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Here's a list of the different elements you can add to your
                template.
              </p>
            </div>
          ),
        }),
        selector: '.scrollable',
        style: stepStyle,
      },
      {
        name: 'tools',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                When building an Instant Article, you'll start with the Article
                element. It's added by default because it's required.
              </p>
            </div>
          ),
        }),
        selector: '.selectors-form',
        style: stepStyle,
      },
      {
        name: 'title-target',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                You can click and drag this icon to an element you see in the
                browser to connect them.
              </p>
            </div>
          ),
        }),
        selector: '.property-article-title .find-button',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'title',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                You can also use CSS selectors. Let's enter the CSS selector for
                the title in this article, which is <code>h2 a</code>.
              </p>
            </div>
          ),
        }),
        selector: '.property-article-title',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'title-valid',
        text: this.buildStepText({
          content: (
            <div>
              <p>Once an element is connected, you'll see a ✔.</p>
            </div>
          ),
        }),
        selector: '.property-article-title label',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'authors-invalid',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Make sure you fill out all of the fields marked with an ✘ or
                your article will not load as an Instant Article.
              </p>
            </div>
          ),
          nextLabel: 'Next',
        }),
        selector: '.property-author-name label',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'authors',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Let's keep going. The CSS selector for Author is{' '}
                <code>p:first-child a</code>
              </p>
            </div>
          ),
        }),
        selector: '.property-author-name',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'content',
        text: this.buildStepText({
          content: (
            <div>
              <p>Connect this element to the body of your article.</p>
              <p>
                Let's do this now with the CSS selector{' '}
                <code>.post-content</code>
              </p>
            </div>
          ),
        }),
        selector: '.property-article-body',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'publish-date-optional',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                The required Article elements are connected. You can also
                connect optional elements like Published Date and Hero Image.
              </p>
            </div>
          ),
        }),
        selector: '.property-article-publish label',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'preview',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Once all of the required Article elements are connected, you'll
                be able to see a preview of what the Instant Article may look
                like.
              </p>
            </div>
          ),
        }),
        selector: '.preview',
        position: 'left',
        style: stepStyle,
      },
      {
        name: 'tools',
        text: this.buildStepText({
          content: (
            <div>
              <p>The toolbar lets you:</p>
              <ul>
                <li>
                  Create a{' '}
                  <b>
                    <Icon name="file outline" />New
                  </b>{' '}
                  template
                </li>
                <li>
                  <b>
                    <Icon name="folder open" />Open
                  </b>{' '}
                  an existing file
                </li>
                <li>
                  <b>
                    <Icon name="save" />Save
                  </b>{' '}
                  your template to a file
                </li>
              </ul>
            </div>
          ),
        }),
        selector: '.tools',
        style: stepStyle,
      },
      {
        name: 'report-bug',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Report a <Icon name="bug" />bug on our <Icon name="github" />GitHub
                repository to let us know if something is broken or not working
                correctly.
              </p>
            </div>
          ),
        }),
        selector: '.report-bug',
        style: stepStyle,
      },
      {
        name: 'help',
        text: this.buildStepText({
          content: (
            <div>
              <p>You've completed the tour.</p>
              <p>
                <a
                  tabIndex="0"
                  role="button"
                  onClick={() => shell.openExternal(helpURL)}
                >
                  <Icon name="info circle" /> You can also read our developer
                  docs to learn more.
                </a>
              </p>
              <p>
                Just click{' '}
                <b>
                  <Icon name="help circle" />Help
                </b>{' '}
                to take this tour again at any time.
              </p>
            </div>
          ),
          icon: 'check',
          nextLabel: 'Done',
          color: 'green',
          extraButtons: (
            <span>
              <Button icon labelPosition="left" onClick={this.restart}>
                <Icon name="refresh" /> Restart Tour
              </Button>
            </span>
          ),
        }),
        selector: '.nux-open',
        style: stepStyle,
      },
    ];
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.editor.takeTour == false &&
      this.props.editor.takeTour == true
    ) {
      if (this.joyride != null) {
        this.joyride.reset(true);
      }
    }
  }

  callback = (event: { type: string, step: { name: string } }) => {
    const firstRule = this.props.rules.first();

    switch (event.type) {
      case 'finished':
        EditorActions.stopTour();
        break;
      case 'step:after':
        switch (event.step.name) {
          case 'new-configuration':
            this.newConfiguration();
            break;
          case 'address':
            EditorActions.loadURL(tutorialSite);
            break;
          case 'title':
            if (firstRule != null) {
              const property = firstRule.properties.get('article.title');
              if (property != null) {
                const field = property.set('selector', 'h2 a');
                RuleActions.editField(field);
                EditorActions.focusField(field);
              }
            }
            break;
          case 'authors':
            if (firstRule != null) {
              const property = firstRule.properties.get('author.name');
              if (property != null) {
                const field = property.set('selector', 'p:first-child a');
                RuleActions.editField(field);
                EditorActions.focusField(field);
              }
            }
            break;
          case 'content':
            if (firstRule != null) {
              const property = firstRule.properties.get('article.body');
              if (property != null) {
                const field = property.set('selector', '.post-content');
                RuleActions.editField(field);
                EditorActions.focusField(field);
              }
            }
            break;
        }
        break;
    }
  };

  render() {
    return (
      <Joyride
        ref={joyride => {
          this.joyride = joyride;
        }}
        type="continuous"
        steps={this.getSteps()}
        run={this.props.editor.takeTour}
        showStepsProgress={true}
        debug={false}
        autoStart={true}
        disableOverlay={true}
        callback={this.callback}
        scrollToSteps={false}
        resizeDebounce={true}
        resizeDebounceDelay={1000}
        keyboardNavigation={false}
      />
    );
  }
}

export default NUXTour;
