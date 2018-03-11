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
import { Button, Icon } from 'semantic-ui-react';
import type { Props } from '../containers/AppContainer.react';
import RuleExporter from '../utils/RuleExporter';
import { version } from '../version';
import { shell } from 'electron';

const baseURL =
  'https://github.com/facebook/facebook-instant-articles-rules-editor' +
  '/issues/new?labels=bug';

export class BugReporter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  getBody = () => {
    // Template
    //---------
    const body = `
# Steps required to reproduce the problem
1.
2.
3.

# Expected Result
*

# Actual Result
*

# Environment Info
**VERSION**: \`${version}\`
**URL**: \`${this.props.editor.url}\`
**RULES**:
\`\`\`json
${JSON.stringify(
      RuleExporter.export(this.props.rules, this.props.settings),
      null,
      2
    )}
\`\`\``;
    //----------------
    // End of template

    return body.trim();
  };

  getBugReportURL = () => {
    const body = encodeURIComponent(this.getBody());
    return `${baseURL}&body=${body}`;
  };

  openBugReport = () => {
    let url = this.getBugReportURL();
    if (!shell.openExternal(url)) {
      // If the window is not open use the in-app browser.
      // This can happen on Windows if the url is too long.
      window.open(url);
    }
  };

  render() {
    return (
      <Button
        icon
        className="report-bug"
        color="facebook"
        as="a"
        onClick={this.openBugReport}
      >
        <Icon name="bug" /> Report a Bug
      </Button>
    );
  }
}
