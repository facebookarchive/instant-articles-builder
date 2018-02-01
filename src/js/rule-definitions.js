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
import RuleCategories from './models/RuleCategories';
import type { RuleDefinition } from './models/RuleDefinition';
import { RuleDefinitionFactory } from './models/RuleDefinition';
import { RulePropertyDefinitionFactory } from './models/RulePropertyDefinition';
import { RulePropertyFactory } from './models/RuleProperty';

const ruleDefinitions: RuleDefinition[] = [];

ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'GlobalRule',
    category: RuleCategories.BASIC,
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
        required: true,
      }),
      'article.publish': RulePropertyDefinitionFactory({
        name: 'article.publish',
        displayName: 'Published Date',
        placeholder: 'Example: time',
        defaultAttribute: 'datetime',
        supportedTypes: Set([RulePropertyTypes.DATETIME]),
        defaultType: RulePropertyTypes.DATETIME,
      }),
      'author.name': RulePropertyDefinitionFactory({
        name: 'author.name',
        displayName: 'Author(s)',
        placeholder: 'Example: span.author',
        defaultAttribute: 'textContent',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        required: true,
        unique: false,
      }),
      'image.url': RulePropertyDefinitionFactory({
        name: 'image.url',
        displayName: 'Hero Image',
        placeholder: 'Example: div.hero-image img',
        defaultAttribute: 'src',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
      }),
      'article.body': RulePropertyDefinitionFactory({
        name: 'article.body',
        displayName: 'Article Content',
        placeholder: 'Example: article',
        defaultAttribute: 'content',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultType: RulePropertyTypes.ELEMENT,
        required: true,
      }),
      'article.canonical': RulePropertyDefinitionFactory({
        name: 'article.canonical',
        displayName: 'Article URL',
        placeholder: 'Example: link[rel=canonical]',
        defaultAttribute: 'href',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        required: true,
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
    category: RuleCategories.TEXT,
    displayName: 'Italic Text',
    placeholder: 'Example: i',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'CaptionRule',
    category: RuleCategories.MEDIA,
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
    category: RuleCategories.TEXT,
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
    category: RuleCategories.TEXT,
    displayName: 'Emphasized Text',
    placeholder: 'Example: em',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'BoldRule',
    category: RuleCategories.TEXT,
    displayName: 'Bold Text',
    placeholder: 'Example: b, strong',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ParagraphRule',
    category: RuleCategories.TEXT,
    displayName: 'Paragraph',
    placeholder: 'Example: p',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'ListItemRule',
    category: RuleCategories.TEXT,
    displayName: 'List Item',
    placeholder: 'Example: li',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'SponsorRule',
    category: RuleCategories.BASIC,
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
    category: RuleCategories.TEXT,
    displayName: 'List',
    placeholder: 'Example: ol, ul',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'BlockquoteRule',
    category: RuleCategories.TEXT,
    displayName: 'Block Quotation',
    placeholder: 'Example: blockquote',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'H1Rule',
    category: RuleCategories.TEXT,
    displayName: 'Title, Header (h1)',
    placeholder: 'Example: title, h1',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'H2Rule',
    category: RuleCategories.TEXT,
    displayName: 'Sub-title, Header (h2)',
    placeholder: 'Example: h2',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'RelatedArticlesRule',
    category: RuleCategories.WIDGETS,
    displayName: 'Related Articles (In-line)',
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
    name: 'FooterRelatedArticlesRule',
    category: RuleCategories.WIDGETS,
    displayName: 'Related Articles (Footer)',
    placeholder: 'Example: ul.op-related-articles',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'RelatedItemRule',
    category: RuleCategories.WIDGETS,
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
    category: RuleCategories.MEDIA,
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
      'image.credit': RulePropertyDefinitionFactory({
        name: 'image.credit',
        displayName: 'Credit',
        placeholder: 'Example: cite',
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
    category: RuleCategories.ADVANCED,
    displayName: 'Pass Through',
    placeholder: 'Example: div.foo',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'IgnoreRule',
    category: RuleCategories.ADVANCED,
    displayName: 'Ignore',
    placeholder: 'Example: div.bar',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'SlideshowRule',
    category: RuleCategories.MEDIA,
    displayName: 'Slideshow (Container)',
    placeholder: 'Example: div.slideshow',
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'SlideshowImageRule',
    category: RuleCategories.MEDIA,
    displayName: 'Slideshow Image',
    placeholder: 'Example: div.img',
    properties: Map({
      'image.url': RulePropertyDefinitionFactory({
        name: 'image.url',
        displayName: 'Image URL',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'src',
        required: true,
      }),
      'caption.title': RulePropertyDefinitionFactory({
        name: 'caption.title',
        displayName: 'Caption (Title)',
        placeholder: 'Example: p.caption',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'textContent',
      }),
      'caption.credit': RulePropertyDefinitionFactory({
        name: 'caption.credit',
        displayName: 'Caption (Credit)',
        placeholder: 'Example: p.credit',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'textContent',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'InteractiveRule',
    category: RuleCategories.MEDIA,
    displayName: 'Embed',
    placeholder: 'Example: div.embed',
    properties: Map({
      'interactive.iframe': RulePropertyDefinitionFactory({
        name: 'interactive.iframe',
        displayName: 'Embed Contents',
        placeholder: 'Example: img',
        supportedTypes: Set([RulePropertyTypes.ELEMENT]),
        defaultType: RulePropertyTypes.ELEMENT,
        defaultAttribute: 'content',
      }),
      'interactive.url': RulePropertyDefinitionFactory({
        name: 'interactive.url',
        displayName: 'Embed URL (iframe)',
        placeholder: 'Example: iframe',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'src',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'VideoRule',
    category: RuleCategories.MEDIA,
    displayName: 'Video',
    placeholder: 'Example: video',
    properties: Map({
      'video.url': RulePropertyDefinitionFactory({
        name: 'video.url',
        displayName: 'URL',
        placeholder: 'Example: video',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'src',
        required: true,
      }),
      'video.type': RulePropertyDefinitionFactory({
        name: 'video.type',
        displayName: 'Content Type',
        placeholder: 'Example: video',
        supportedTypes: Set([RulePropertyTypes.STRING]),
        defaultType: RulePropertyTypes.STRING,
        defaultAttribute: 'type',
      }),
    }),
  })
);
ruleDefinitions.push(
  RuleDefinitionFactory({
    name: 'FooterRule',
    category: RuleCategories.BASIC,
    displayName: 'Footer',
    placeholder: 'Example: footer',
  })
);
module.exports = ruleDefinitions;
