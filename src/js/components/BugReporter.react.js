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
import App from './App.react';

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
**VERSION**: \`${App.version}\`
**URL**: \`${this.props.editor.url}\`
**RULES**:
\`\`\`json
${JSON.stringify(RuleExporter.export(this.props.rules), null, 2)}
\`\`\``;
    //----------------
    // End of template

    return body.trim();
  };

  getBugReportURL = () => {
    const body = encodeURIComponent(this.getBody());
    return `${baseURL}&body=${body}`;
  };

  render() {
    return (
      <Button
        icon
        className="report-bug"
        color="facebook"
        as="a"
        target="_blank"
        href={this.getBugReportURL()}
      >
        <Icon name="bug" /> Report a Bug
      </Button>
    );
  }
}
