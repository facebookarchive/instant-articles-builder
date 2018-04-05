/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This tests all the cases listed here: http://www.php.net/manual/en/function.date.php
 */

import moment from '../phpFormatMoment';

function formatTest(moment, phpFormat, expected, description) {
  it(description, () => {
    const res = moment.formatPHP(phpFormat);
    expect(res).toEqual(expected);
  });
}

describe('phpFormatMoment', () => {
  describe('given a valid utc moment', () => {
    const utcTime = moment.utc('2016-01-03T13:01:03.153');

    // Day
    formatTest(
      utcTime,
      'd',
      '03',
      'outputs the right Day of the month, 2 digits with leading zeros'
    );
    formatTest(
      utcTime,
      'D',
      'Sun',
      'outputs the right textual representation of a day, three letters'
    );
    formatTest(
      utcTime,
      'j',
      '3',
      'outputs the right day of the month without leading zeros'
    );
    formatTest(
      utcTime,
      'l',
      'Sunday',
      'outputs the right full textual representation of the day of the week'
    );
    formatTest(
      utcTime,
      'N',
      '7',
      'outputs the right ISO-8601 numeric representation of the day of the week (1-7)'
    );
    formatTest(
      utcTime,
      'S',
      'rd',
      'outputs the right English ordinal suffix for the day of the month, 2 characters'
    );
    formatTest(
      utcTime,
      'w',
      '0',
      'outputs the right numeric representation of the day of the week (0-6)'
    );
    formatTest(
      utcTime,
      'z',
      '2',
      'outputs the right day of the year (starting from 0)'
    );

    // Week
    formatTest(
      utcTime,
      'W',
      '53',
      'outputs the right ISO-8601 week number of year, weeks starting on Monday'
    );

    // Month
    formatTest(
      utcTime,
      'F',
      'January',
      'outputs the right full textual representation of a month, such as January or March'
    );
    formatTest(
      utcTime,
      'm',
      '01',
      'outputs the right numeric representation of a month, with leading zeros'
    );
    formatTest(
      utcTime,
      'M',
      'Jan',
      'outputs the right short textual representation of a month, three letters'
    );
    formatTest(
      utcTime,
      'n',
      '1',
      'outputs the right numeric representation of a month, without leading zeros'
    );
    formatTest(
      utcTime,
      't',
      '31',
      'outputs the right number of days in the given month'
    );

    // Year
    formatTest(utcTime, 'L', '1', 'outputs the info whether its a leap year');
    formatTest(
      utcTime,
      'o',
      '2015',
      'outputs the right ISO-8601 week-numbering year'
    );
    formatTest(
      utcTime,
      'Y',
      '2016',
      'outputs the right full numeric representation of a year, 4 digits'
    );
    formatTest(
      utcTime,
      'y',
      '16',
      'outputs the right two digit representation of a year'
    );

    // Time
    formatTest(
      utcTime,
      'a',
      'pm',
      'outputs the right lowercase Ante meridiem and Post meridiem'
    );
    formatTest(
      utcTime,
      'A',
      'PM',
      'outputs the right uppercase Ante meridiem and Post meridiem'
    );
    formatTest(
      utcTime,
      'B',
      '584',
      'outputs the right Swatch Internet time ¯\\_(ツ)_/¯'
    );
    formatTest(
      utcTime,
      'g',
      '1',
      'outputs the right 12-hour format of an hour without leading zeros'
    );
    formatTest(
      utcTime,
      'G',
      '13',
      'outputs the right 24-hour format of an hour without leading zeros'
    );
    formatTest(
      utcTime,
      'h',
      '01',
      'outputs the right 12-hour format of an hour with leading zeros'
    );
    formatTest(
      utcTime,
      'H',
      '13',
      'outputs the right 24-hour format of an hour with leading zeros'
    );
    formatTest(
      utcTime,
      'i',
      '01',
      'outputs the right minutes with leading zeros'
    );
    formatTest(
      utcTime,
      's',
      '03',
      'outputs the right seconds, with leading zeros'
    );
    formatTest(utcTime, 'v', '153', 'outputs the right number of milliseconds');

    // Timezone
    formatTest(utcTime, 'e', 'e', 'outputs the right timezone identifier'); // Moment does not have this
    formatTest(
      utcTime,
      'I',
      '0',
      'outputs whether or not the date is in daylight saving time '
    );
    formatTest(
      utcTime,
      'O',
      '+0000',
      'outputs the difference to Greenwich time (GMT) in hours '
    );
    formatTest(
      utcTime,
      'P',
      '+00:00',
      'outputs the difference to Greenwich time (GMT) with colon between hours and minutes '
    );
    formatTest(utcTime, 'T', 'T', 'outputs the right timezone abbreviation');
    formatTest(
      utcTime,
      'Z',
      '0',
      'outputs the right timezone offset in seconds.'
    );

    // Full Date/Time
    formatTest(
      utcTime,
      'c',
      '2016-01-03T13:01:03+00:00',
      'outputs the right ISO 8601 date.'
    );
    formatTest(
      utcTime,
      'r',
      'Sun, 03 Jan 2016 13:01:03 +0000',
      'outputs the right RFC 2822 formatted date.'
    );
    formatTest(
      utcTime,
      'U',
      '1451826063',
      'outputs the right seconds since the Unix Epoch .'
    );
  });
});
