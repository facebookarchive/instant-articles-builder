/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Rule {
  constructor(clazz, selector, properties) {
    this.class = clazz;
    this.selector = selector;
    this.properties = typeof properties === 'undefined' ? [] : properties;
  }

  addProperty(property) {
    this.properties.push(property);
    return this;
  }

  toJSON() {
    if (!this.class || !this.selector) {
      return null;
    }

    let json = {};
    const properties = {};

    json.class = this.class;
    json.selector = this.selector;

    this.properties.forEach(property => {
      properties[property.property] = property.toJSON();
    });

    if (Object.keys(properties).length > 0) {
      json.properties = properties;
    }

    return json;
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = Rule;
