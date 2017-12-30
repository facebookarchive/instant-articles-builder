/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import RuleDefinition from './models/RuleDefinition';
import RulePropertyDefinition from './models/RulePropertyDefinition';
import RulePropertyTypes from './models/RulePropertyTypes.js';

const ruleDefinitions: RuleDefinition[] = [];

ruleDefinitions.push(
  new RuleDefinition({
    className: 'GlobalRule',
    placeholder: 'Example: html',
    displayName: 'Article Structure',
    properties: [
      new RulePropertyDefinition({
        name: 'article.title',
        displayName: 'Title',
        placeholder: 'Example: h1',
        defaultAttribute: 'content',
        supportedTypes: [RulePropertyTypes.ELEMENT],
        unique: true,
        required: true,
      }),
      new RulePropertyDefinition({
        name: 'article.publish',
        displayName: 'Published Date',
        placeholder: 'Example: time',
        defaultAttribute: 'datetime',
        supportedTypes: [RulePropertyTypes.DATETIME],
        unique: true,
        required: true,
      }),
      new RulePropertyDefinition({
        name: 'author.name',
        displayName: 'Author(s)',
        placeholder: 'Example: span.author',
        defaultAttribute: 'contentString',
        supportedTypes: [RulePropertyTypes.STRING],
        required: true,
      }),
      new RulePropertyDefinition({
        name: 'image.url',
        displayName: 'Hero Image',
        placeholder: 'Example: div.hero-image img',
        defaultAttribute: 'src',
        supportedTypes: [RulePropertyTypes.STRING],
        unique: true,
      }),
      new RulePropertyDefinition({
        name: 'article.body',
        displayName: 'Article Content',
        placeholder: 'Example: article',
        defaultAttribute: 'content',
        supportedTypes: [RulePropertyTypes.ELEMENT],
        required: true,
        unique: true,
      }),
    ],
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'ItalicRule',
    displayName: 'Italic Text',
    placeholder: 'Example: i',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'CaptionRule',
    displayName: 'Caption',
    placeholder: 'Example: article',
    properties: [
      new RulePropertyDefinition({
        name: 'caption.default',
        displayName: 'Default',
        placeholder: 'Example: img',
        supportedTypes: [RulePropertyTypes.ELEMENT],
        defaultAttribute: 'content',
      }),
    ],
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'AnchorRule',
    displayName: 'Link',
    placeholder: 'Example: a',
    properties: [
      new RulePropertyDefinition({
        name: 'anchor.href',
        displayName: 'HRef',
        placeholder: 'Example: a',
        supportedTypes: [RulePropertyTypes.STRING],
        defaultAttribute: 'href',
        required: true,
      }),
      new RulePropertyDefinition({
        name: 'anchor.rel',
        displayName: 'Rel',
        placeholder: 'Example: a',
        supportedTypes: [RulePropertyTypes.STRING],
        defaultAttribute: 'rel',
      }),
    ],
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'EmphasizedRule',
    displayName: 'Emphasized Text',
    placeholder: 'Example: em',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'BoldRule',
    displayName: 'Bold Text',
    placeholder: 'Example: b, strong',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'ParagraphRule',
    displayName: 'Paragraph',
    placeholder: 'Example: p',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'ListItemRule',
    placeholder: 'Example: li',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'SponsorRule',
    displayName: 'Sponsor(s)',
    placeholder: 'Example: ul.op-sponsors',
    properties: [
      new RulePropertyDefinition({
        name: 'sponsor.page_url',
        displayName: 'Page URL',
        placeholder: 'Example: a',
        defaultAttribute: 'href',
        supportedTypes: [RulePropertyTypes.STRING],
        required: true,
      }),
    ],
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'ListElementRule',
    displayName: 'List',
    placeholder: 'Example: ol, ul',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'BlockquoteRule',
    displayName: 'Block Quotation',
    placeholder: 'Example: blockquote',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'H1Rule',
    displayName: 'Title, Header (h1)',
    placeholder: 'Example: title, h1',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'H2Rule',
    displayName: 'Sub-title, Header (h2)',
    placeholder: 'Example: h2',
  })
);
ruleDefinitions.push(
  new RuleDefinition({
    className: 'RelatedArticlesRule',
    displayName: 'Related Articles',
    placeholder: 'Example: ul.op-related-articles',
    properties: [
      new RulePropertyDefinition({
        name: 'related.title',
        displayName: 'Section Title',
        placeholder: 'Example: ul.op-related-articles',
        supportedTypes: [RulePropertyTypes.STRING],
        defaultAttribute: 'title',
      }),
    ],
  })
);

module.exports = ruleDefinitions;
