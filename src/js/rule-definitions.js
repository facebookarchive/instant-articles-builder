/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Map, Set } from 'immutable';
import RulePropertyTypes from './models/RulePropertyTypes.js';
import type { RuleDefinition } from './models/RuleDefinition';
import type { RulePropertyDefinition } from './models/RulePropertyDefinition';
import { RuleDefinitionFactory } from './models/RuleDefinition';
import { RulePropertyDefinitionFactory } from './models/RulePropertyDefinition';

const ruleDefinitions: RuleDefinition[] = [];

ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'GlobalRule',
    placeholder: 'Example: html',
    displayName: 'Article Structure',
    unique: true,
    properties: Map({
      'article.title': RulePropertyDefinitionFactory({
        name: 'article.title',
        displayName: 'Title',
        placeholder: 'Example: h1',
        defaultAttribute: 'content',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        unique: true,
        required: true,
      }),
      'article.publish': RulePropertyDefinitionFactory({
        name: 'article.publish',
        displayName: 'Published Date',
        placeholder: 'Example: time',
        defaultAttribute: 'datetime',
        supportedTypes: Set([RulePropertyTypes.DATETIME]),
        unique: true,
        required: true,
      }),
      'author.name': RulePropertyDefinitionFactory({
        name: 'author.name',
        displayName: 'Author(s)',
        placeholder: 'Example: span.author',
        defaultAttribute: 'contentString',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        required: true,
      }),
      'image.url': RulePropertyDefinitionFactory({
        name: 'image.url',
        displayName: 'Hero Image',
        placeholder: 'Example: div.hero-image img',
        defaultAttribute: 'src',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        unique: true,
      }),
      'article.body': RulePropertyDefinitionFactory({
        name: 'article.body',
        displayName: 'Article Content',
        placeholder: 'Example: article',
        defaultAttribute: 'content',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        required: true,
        unique: true,
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'ItalicRule',
    displayName: 'Italic Text',
    placeholder: 'Example: i',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'CaptionRule',
    displayName: 'Caption',
    placeholder: 'Example: article',
    properties: Map({
      'caption.default': RulePropertyDefinitionFactory({
        name: 'caption.default',
        displayName: 'Default',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultAttribute: 'content',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'AnchorRule',
    displayName: 'Link',
    placeholder: 'Example: a',
    properties: Map({
      'anchor.href': RulePropertyDefinitionFactory({
        name: 'anchor.href',
        displayName: 'HRef',
        placeholder: 'Example: a',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultAttribute: 'href',
        required: true,
      }),
      'anchor.rel': RulePropertyDefinitionFactory({
        name: 'anchor.rel',
        displayName: 'Rel',
        placeholder: 'Example: a',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultAttribute: 'rel',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'EmphasizedRule',
    displayName: 'Emphasized Text',
    placeholder: 'Example: em',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'BoldRule',
    displayName: 'Bold Text',
    placeholder: 'Example: b, strong',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'ParagraphRule',
    displayName: 'Paragraph',
    placeholder: 'Example: p',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'ListItemRule',
    displayName: 'List Item',
    placeholder: 'Example: li',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'SponsorRule',
    displayName: 'Sponsor(s)',
    placeholder: 'Example: ul.op-sponsors',
    properties: Map({
      'sponsor.page_url': RulePropertyDefinitionFactory({
        name: 'sponsor.page_url',
        displayName: 'Page URL',
        placeholder: 'Example: a',
        defaultAttribute: 'href',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        required: true,
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'ListElementRule',
    displayName: 'List',
    placeholder: 'Example: ol, ul',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'BlockquoteRule',
    displayName: 'Block Quotation',
    placeholder: 'Example: blockquote',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'H1Rule',
    displayName: 'Title, Header (h1)',
    placeholder: 'Example: title, h1',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'H2Rule',
    displayName: 'Sub-title, Header (h2)',
    placeholder: 'Example: h2',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    className: 'RelatedArticlesRule',
    displayName: 'Related Articles',
    placeholder: 'Example: ul.op-related-articles',
    properties: Map({
      'related.title': RulePropertyDefinitionFactory({
        name: 'related.title',
        displayName: 'Section Title',
        placeholder: 'Example: ul.op-related-articles',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultAttribute: 'title',
      }),
    }),
  })
);

module.exports = ruleDefinitions;
