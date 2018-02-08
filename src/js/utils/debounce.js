/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ignores all but the last call to a function during a specified time window.
 *
 * @param {function} func The function to debounce
 * @param {number} wait The debounce time window in milisseconds
 * @param {boolean} immediate {boolean} Whether to accept the first call immediately (defaults to false)
 *
 * @returns {function} The debounced version of the provided function
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

module.exports = debounce;
