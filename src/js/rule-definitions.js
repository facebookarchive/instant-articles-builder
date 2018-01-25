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
import { RuleDefinitionFactory } from './models/RuleDefinition';
import { RulePropertyDefinitionFactory } from './models/RulePropertyDefinition';
import { RulePropertyFactory } from './models/RuleProperty';

const ruleDefinitions: RuleDefinition[] = [];

ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'GlobalRule',
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
        defaultType: RulePropertyTypes.ELEMENT,
        unique: true,
        required: true,
      }),
      'article.publish': RulePropertyDefinitionFactory({
        name: 'article.publish',
        displayName: 'Published Date',
        placeholder: 'Example: time',
        defaultAttribute: 'datetime',
        supportedTypes: Set([RulePropertyTypes.DATETIME]),
        defaultType: RulePropertyTypes.DATETIME,
        unique: true,
        required: true,
      }),
      'author.name': RulePropertyDefinitionFactory({
        name: 'author.name',
        displayName: 'Author(s)',
        placeholder: 'Example: span.author',
        defaultAttribute: 'contentString',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        required: true,
      }),
      'image.url': RulePropertyDefinitionFactory({
        name: 'image.url',
        displayName: 'Hero Image',
        placeholder: 'Example: div.hero-image img',
        defaultAttribute: 'src',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        unique: true,
      }),
      'article.body': RulePropertyDefinitionFactory({
        name: 'article.body',
        displayName: 'Article Content',
        placeholder: 'Example: article',
        defaultAttribute: 'content',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultType: RulePropertyTypes.ELEMENT,
        required: true,
        unique: true,
      }),
      'article.url': RulePropertyDefinitionFactory({
        name: 'article.url',
        displayName: 'Article URL',
        placeholder: 'Example: link[rel=canonical]',
        defaultAttribute: 'href',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        required: true,
        unique: true,
        defaultProperty: RulePropertyFactory({
          selector: 'link[rel=canonical]',
          attribute: 'href',
        }),
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ItalicRule',
    displayName: 'Italic Text',
    placeholder: 'Example: i',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'CaptionRule',
    displayName: 'Caption',
    placeholder: 'Example: article',
    properties: Map({
      'caption.default': RulePropertyDefinitionFactory({
        name: 'caption.default',
        displayName: 'Default',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultType: RulePropertyTypes.ELEMENT,
        defaultAttribute: 'content',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'AnchorRule',
    displayName: 'Link',
    placeholder: 'Example: a',
    properties: Map({
      'anchor.href': RulePropertyDefinitionFactory({
        name: 'anchor.href',
        displayName: 'HRef',
        placeholder: 'Example: a',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'href',
        required: true,
      }),
      'anchor.rel': RulePropertyDefinitionFactory({
        name: 'anchor.rel',
        displayName: 'Rel',
        placeholder: 'Example: a',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'rel',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'EmphasizedRule',
    displayName: 'Emphasized Text',
    placeholder: 'Example: em',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'BoldRule',
    displayName: 'Bold Text',
    placeholder: 'Example: b, strong',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ParagraphRule',
    displayName: 'Paragraph',
    placeholder: 'Example: p',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ListItemRule',
    displayName: 'List Item',
    placeholder: 'Example: li',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'SponsorRule',
    displayName: 'Sponsor(s)',
    placeholder: 'Example: ul.op-sponsors',
    properties: Map({
      'sponsor.page_url': RulePropertyDefinitionFactory({
        name: 'sponsor.page_url',
        displayName: 'Page URL',
        placeholder: 'Example: a',
        defaultAttribute: 'href',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        required: true,
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ListElementRule',
    displayName: 'List',
    placeholder: 'Example: ol, ul',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'BlockquoteRule',
    displayName: 'Block Quotation',
    placeholder: 'Example: blockquote',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'H1Rule',
    displayName: 'Title, Header (h1)',
    placeholder: 'Example: title, h1',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'H2Rule',
    displayName: 'Sub-title, Header (h2)',
    placeholder: 'Example: h2',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'RelatedArticlesRule',
    displayName: 'Related Articles',
    placeholder: 'Example: ul.op-related-articles',
    properties: Map({
      'related.title': RulePropertyDefinitionFactory({
        name: 'related.title',
        displayName: 'Section Title',
        placeholder: 'Example: ul.op-related-articles',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'title',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'RelatedItemRule',
    displayName: 'Related Item',
    placeholder: 'Example: li',
    properties: Map({
      'related.url': RulePropertyDefinitionFactory({
        name: 'related.url',
        displayName: 'URL',
        placeholder: 'Example: a',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'href',
        required: true,
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ImageRule',
    displayName: 'Image',
    placeholder: 'Example: img',
    properties: Map({
      'image.url': RulePropertyDefinitionFactory({
        name: 'image.url',
        displayName: 'URL',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'src',
        required: true,
      }),
      'image.caption': RulePropertyDefinitionFactory({
        name: 'image.caption',
        displayName: 'Caption',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultType: RulePropertyTypes.ELEMENT,
        defaultAttribute: 'content',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'PassThroughRule',
    displayName: 'Pass Through',
    placeholder: 'Example: div.foo',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'IgnoreRule',
    displayName: 'Ignore',
    placeholder: 'Example: div.bar',
  })
);

module.exports = ruleDefinitions;
