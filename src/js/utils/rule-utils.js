/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Rule = require('../models/rule.js');
const RuleProperty = require('../models/rule-property.js');

function buildRule(payload) {
  const rule = new Rule(payload.class, payload.selector);

  Object.entries(payload.properties).forEach(([propertyName, item]) => {
    const type = item.attribute === 'content' ? 'element' : 'string';
    const property = new RuleProperty(propertyName, type, item.selector);
    if (item.attribute) {
      property.withAttribute(item.attribute);
    }

    rule.addProperty(property);
  });

  return rule;
}

function getUpdatedRules(payload) {
  return {
    rules: payload.map(rule => buildRule(rule).toJSON()),
  };
}

module.exports = { buildRule: buildRule, getUpdatedRules: getUpdatedRules };
