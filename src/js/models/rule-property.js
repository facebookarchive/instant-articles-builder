/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

class RuleProperty {
  constructor(property, type, selector) {
    this.property = property;
    this.selector = selector;
    this.type = type;
  }

  withAttribute(attribute) {
    this.attribute = attribute;
    return this;
  }

  withFormat(format) {
    this.format = format;
    return this;
  }

  toJSON() {
    return {
      type: this.type,
      selector: this.selector,
      attribute: this.attribute,
      format: this.format,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = RuleProperty;
