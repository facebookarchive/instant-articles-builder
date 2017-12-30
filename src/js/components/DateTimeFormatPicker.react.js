/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const React = require('react');
const classNames = require('classnames');
const moment = require('moment');
import type { RuleProperty } from '../models/RuleProperty';
import type { Props as BaseProps } from '../containers/AppContainer.react';

type Props = BaseProps & { property: RuleProperty };

const DEFAULT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

type State = {
  displayedDateTime?: ?string,
  moment: ?Object
};

class DateTimeFormatPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      moment: null,
    };
  }

  expectedDateTime(props?: Props): string {
    props = props || this.props;
    return props.app.attributes.get(props.property.attribute).value;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.expectedDateTime(nextProps) !== this.expectedDateTime()) {
      let format = '';
      let m = {};
      if (this.expectedDateTime(nextProps) != null) {
        m = moment.parseZone(this.expectedDateTime(nextProps));
        if (m.isValid()) {
          format = m.creationData().format;
        }
      }

      this.setState({
        moment: m,
        displayedDateTime:
          m && this.props.property.format
            ? m.format(this.props.property.format)
            : null,
      });
      this.formatChanged(format);
    }

    if (nextProps.property.format !== this.props.property.format) {
      this.setState({
        displayedDateTime:
          this.state.moment && nextProps.property.format
            ? this.state.moment.format(nextProps.property.format)
            : null,
      });
    }
  }

  handleFormatChange = (event: Event) => {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const newFormat = inputElement.value;
    }
  };

  formatChanged = (format: string) => {};

  render() {
    let valid =
      !!this.state.displayedDateTime &&
      this.state.displayedDateTime === this.expectedDateTime();
    let classes = classNames({
      'datetime-picker': true,
      match: valid,
      mismatch: !valid,
    });

    let warning = valid ? (
      <div className="notice">📅 {this.state.displayedDateTime}</div>
    ) : (
      <div className="warning">Unable to parse date using this format.</div>
    );

    return (
      <div className={classes}>
        <label className="sub-label">
          DateTime Format String (RFC2822 or ISO)
        </label>
        <input
          type="text"
          placeholder={'Example: ' + DEFAULT_FORMAT}
          value={this.props.property.format}
          disabled={this.expectedDateTime() == null ? 'disabled' : ''}
          onChange={this.handleFormatChange}
          className="date-time-format"
        />
        {warning}
      </div>
    );
  }
}

module.exports = DateTimeFormatPicker;
