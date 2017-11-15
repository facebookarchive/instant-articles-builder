/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const classNames = require('classnames');
const moment = require('moment');

const DEFAULT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

class DateTimeFormatPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moment: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expectedDateTime !== this.props.expectedDateTime) {
      let format, m;
      if (nextProps.expectedDateTime != null) {
        m = moment.parseZone(nextProps.expectedDateTime);
        if (m.isValid()) {
          format = m.creationData().format;
        }
      }

      this.setState({
        moment: m,
        displayedDateTime:
          m && this.props.format ? m.format(this.props.format) : null,
      });
      this.onFormatChanged(m, format);
    }

    if (nextProps.format !== this.props.format) {
      this.setState({
        displayedDateTime:
          this.state.moment && nextProps.format
            ? this.state.moment.format(nextProps.format)
            : null,
      });
    }
  }

  handleFormatChange = event => {
    this.onFormatChanged(this.state.moment, event.target.value);
  };

  onFormatChanged(moment, newFormat) {
    if (this.props.onFormatChanged) {
      this.props.onFormatChanged(newFormat);
    }
  }

  render() {
    let valid =
      !!this.state.displayedDateTime &&
      this.state.displayedDateTime === this.props.expectedDateTime;
    let classes = classNames({
      match: valid,
      mismatch: !valid,
    });

    let warning = valid ? (
      <div className="notice">📅 {this.state.displayedDateTime}</div>
    ) : (
      <div className="warning">Unable to parse date using this format.</div>
    );

    return (
      <div className="datetime-picker" className={classes}>
        <label htmlFor={this.props.name} className="sub-label">
          DateTime Format String (RFC2822 or ISO)
        </label>
        <input
          type="text"
          name={this.props.name}
          placeholder={'Example: ' + DEFAULT_FORMAT}
          value={this.props.format}
          disabled={this.props.expectedDateTime == null ? 'disabled' : ''}
          onChange={this.handleFormatChange}
          className="date-time-format"
          onFocus={this.props.onFocus}
        />
        {warning}
      </div>
    );
  }
}

module.exports = DateTimeFormatPicker;
