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

const importExportEncoding = 'utf8';

const tutorialSite =
  'https://media.fb.com/2016/03/07/instant-articles-wordpress-plugin/';

export class NUXTour extends React.Component<Props> {
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
    EditorActions.filterRules(Set([RuleCategories.BASIC]));
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
              <Icon name="close" /> Cancel Tour
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
              <p>
                In this tour we will learn the basic components of the{' '}
                <b>Rules Editor</b> and create a working rule configuration for
                a sample article.
              </p>
              <p>Let's start by creating a new configuration.</p>
            </div>
          ),
          nextLabel: 'New configuration',
          icon: 'file outline',
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
                Use the address bar to navigate to your site like you would in a
                regular web browser.
              </p>
              <p>Let's load a sample article now.</p>
            </div>
          ),
          nextLabel: 'Load sample article',
          icon: 'globe',
        }),
        selector: '.loader',
        style: stepStyle,
      },
      {
        name: 'browser',
        text: this.buildStepText({
          content: (
            <p>
              Your site will load in the in-app <b>Browser</b>.
            </p>
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
                Your transformation <b>rules</b> will appear here.
              </p>
              <p>
                <b>Rules</b> are used to convert tags on your site into content
                on your Instant Articles.
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
                The <b>Article Structure</b> rule is the most important rule and
                it is added by default.
              </p>
              <p>
                This rule tells where the main structural elements of your page
                are.
              </p>
              <p>Let's configure this rule for the sample article.</p>
            </div>
          ),
        }),
        selector: '.selectors-form',
        style: stepStyle,
      },
      {
        name: 'title',
        text: this.buildStepText({
          content: (
            <div>
              <p>Rules work by using CSS selectors.</p>
              <p>
                The CSS selector for the title in this article is:{' '}
                <code>h2 a</code>.
              </p>
            </div>
          ),
          nextLabel: 'Fill the selector',
          icon: 'code',
        }),
        selector: '.property-article-title',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'title-target',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                You could've clicked on the target icon to visually select the
                element on the browser instead.
              </p>
            </div>
          ),
          nextLabel: 'Next',
        }),
        selector: '.property-article-title .find-button',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'title-valid',
        text: this.buildStepText({
          content: (
            <div>
              <p>Once you're done configuring a field you'll see a ✔ mark.</p>
            </div>
          ),
          nextLabel: 'Next',
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
                Required fields that are not configured are marked with a ✘.
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
              <p>Let's continue configuring the rules.</p>
              <p>
                The selector for the author is: <code>p:first-child a</code>
              </p>
            </div>
          ),
          nextLabel: 'Fill the selector',
          icon: 'code',
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
              <p>
                This property tells where the main content body of your article
                is.
              </p>
              <p>
                Make sure you pick the element that is the{' '}
                <b>immediate parent</b> of the content paragraphs.
              </p>
              <p>
                The selector for this article is: <code>.post-content</code>
              </p>
            </div>
          ),
          nextLabel: 'Fill the selector',
          icon: 'code',
        }),
        selector: '.property-article-body',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'rule-valid',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                Once you finish configuring all required fields for a rule, its
                header will become blue.
              </p>
              <p>Incomplete rules have a grey header instead.</p>
            </div>
          ),
          nextLabel: 'Next',
        }),
        selector: '.selectors-form',
        position: 'right',
        style: stepStyle,
      },
      {
        name: 'preview',
        text: this.buildStepText({
          content: (
            <div>
              <p>
                The Preview window will give you an approximated visualization
                of the Instant Article created by your rules.
              </p>
            </div>
          ),
          nextLabel: 'Next',
        }),
        selector: '.preview',
        position: 'left',
        style: stepStyle,
      },
      {
        name: 'filters',
        text: this.buildStepText({
          content: (
            <div>
              <p>Rules are grouped by categories.</p>
              <p>
                By default, only{' '}
                <b>
                  <Icon name="circle check" />Basic
                </b>{' '}
                rules are displayed. In order to edit or add rules from other
                categories you need to change this filter.
              </p>
            </div>
          ),
        }),
        selector: '.rule-filters',
        style: stepStyle,
      },
      {
        name: 'tools',
        text: this.buildStepText({
          content: (
            <div>
              <p>You can use the toolbar buttons to:</p>
              <ul>
                <li>
                  Create a{' '}
                  <b>
                    <Icon name="file outline" />New
                  </b>{' '}
                  configuration
                </li>
                <li>
                  <b>
                    <Icon name="folder open" />Open
                  </b>{' '}
                  a rules configuration file
                </li>
                <li>
                  <b>
                    <Icon name="save" />Save
                  </b>{' '}
                  your rules configuration to a file
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
                Please let us know if something is broken by reporting a{' '}
                <Icon name="bug" />bug on our <Icon name="github" />GitHub
                repository.
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
              <p>You now know the basic features of the Rules Editor!</p>
              <p>
                <a target="_blank" href={helpURL}>
                  <Icon name="info circle" /> Read the full documentation to
                  learn more.
                </a>
              </p>
              <p>
                If you need help at any time, you can click on the{' '}
                <b>
                  <Icon name="help circle" />Help
                </b>{' '}
                button and restart this tour.
              </p>
            </div>
          ),
          icon: 'check',
          nextLabel: 'Finish tour',
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
