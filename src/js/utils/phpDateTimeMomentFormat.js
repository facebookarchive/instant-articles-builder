/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

(function(m) {
  /*
	 * PHP => moment.js
	 * Will take a php date format and convert it into a JS format for moment
	 * http://www.php.net/manual/en/function.date.php
	 * http://momentjs.com/docs/#/displaying/format/
	 */
  const moment = require('moment');

  var formatMap = {
      d: 'DD',
      D: 'ddd',
      j: 'D',
      l: 'dddd',
      N: 'E',
      S: function() {
        return '[' + this.format('Do').replace(/\d*/g, '') + ']';
      },
      w: 'd',
      z: function() {
        return this.format('DDD') - 1;
      },
      W: 'W',
      F: 'MMMM',
      m: 'MM',
      M: 'MMM',
      n: 'M',
      t: function() {
        return this.daysInMonth();
      },
      L: function() {
        return this.isLeapYear() ? 1 : 0;
      },
      o: 'GGGG',
      Y: 'YYYY',
      y: 'YY',
      a: 'a',
      A: 'A',
      B: function() {
        var thisUTC = this.clone().utc(),
          // Shamelessly stolen from http://javascript.about.com/library/blswatch.htm
          swatch =
            (thisUTC.hours() + 1) % 24 +
            thisUTC.minutes() / 60 +
            thisUTC.seconds() / 3600;
        return Math.floor(swatch * 1000 / 24);
      },
      g: 'h',
      G: 'H',
      h: 'hh',
      H: 'HH',
      i: 'mm',
      s: 'ss',
      u: '[u]', // not sure if moment has this
      e: '[e]', // moment does not have this
      I: function() {
        return this.isDST() ? 1 : 0;
      },
      O: 'ZZ',
      P: 'Z',
      T: '[T]', // deprecated in moment
      Z: function() {
        return parseInt(this.format('ZZ'), 10) * 36;
      },
      c: 'YYYY-MM-DD[T]HH:mm:ssZ',
      r: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
      U: 'X',
    },
    formatEx = /[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;

  moment.fn.formatPHP = function(format) {
    var that = this;

    return this.format(
      format.replace('\\T', 'T').replace(formatEx, function(phpStr) {
        return typeof formatMap[phpStr] === 'function'
          ? formatMap[phpStr].call(that)
          : formatMap[phpStr];
      })
    );
  };
})();
