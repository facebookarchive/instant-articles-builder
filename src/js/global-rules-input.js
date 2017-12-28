/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  rules: [
    {
      class: 'GlobalRule',
      showByDefault: false,
      defaultSelector: 'html',
      properties: {
        'article.title': {
          label: 'Title',
          placeholder: 'Example: h1',
          defaultAttribute: 'content',
          required: true,
        },
        'article.publish': {
          label: 'Published Date',
          placeholder: 'Example: time',
          defaultAttribute: 'datetime',
          type: 'DateTime',
          required: true,
        },
        'author.name': {
          label: 'Author(s)',
          placeholder: 'Example: span.author',
          defaultAttribute: 'content',
          multiple: true,
          required: true,
        },
        'image.url': {
          label: 'Hero Image',
          placeholder: 'Example: div.hero-image img',
          defaultAttribute: 'src',
          required: true,
        },
        'article.body': {
          label: 'Article Content',
          placeholder: 'Example: article',
          defaultAttribute: 'content',
          required: true,
        },
      },
    },
    {
      class: 'ItalicRule',
      defaultSelector: 'i',
    },
    {
      class: 'CaptionRule',
      defaultSelector: 'article',
      showByDefault: false,
      properties: {
        'caption.default': {
          label: 'Default',
          placeholder: 'Example: img',
          defaultAttribute: 'content',
        },
      },
    },
    {
      class: 'AnchorRule',
      defaultSelector: 'a',
      properties: {
        'anchor.href': {
          label: 'Destination',
          placeholder: 'Example: a',
          defaultAttribute: 'href',
        },
        'anchor.rel': {
          label: 'Relationship',
          placeholder: 'Example: a',
          defaultAttribute: 'rel',
        },
      },
    },
    {
      class: 'EmphasizedRule',
      defaultSelector: 'em',
    },
    {
      class: 'BoldRule',
      defaultSelector: 'b, strong',
    },
    {
      class: 'ParagraphRule',
      defaultSelector: 'p',
      showByDefault: true,
    },
    {
      class: 'ParagraphFooterRule',
      defaultSelector: 'p',
    },
    {
      class: 'ListItemRule',
      defaultSelector: 'li',
    },
    {
      class: 'SponsorRule',
      displayName: 'Sponsor(s)',
      defaultSelector: 'ul.op-sponsors',
      properties: {
        'sponsor.page_url': {
          label: 'Page URL',
          placeholder: 'Example: a',
          defaultAttribute: 'href',
          multiple: true,
        },
      },
    },
    {
      class: 'ListElementRule',
      displayName: 'List',
      defaultSelector: 'ol, ul',
    },
    {
      class: 'BlockquoteRule',
      displayName: 'Block Quotation',
      defaultSelector: 'blockquote',
    },
    {
      class: 'H1Rule',
      displayName: 'Title, Header (h1)',
      defaultSelector: 'title, h1',
      properties: {
        'h1.class': {
          label: 'Class',
          placeholder: 'Example: link',
          defaultAttribute: 'class',
        },
      },
    },
    {
      class: 'H2Rule',
      displayName: 'Header (h2)',
      defaultSelector: 'h2',
      properties: {
        'h2.class': {
          label: 'Class',
          placeholder: 'Example: link',
          defaultAttribute: 'class',
        },
      },
    },
    {
      class: 'HeaderRule',
      defaultSelector: 'header',
    },
    {
      class: 'FooterSmallRule',
      defaultSelector: 'small',
    },
    {
      class: 'FooterRule',
      defaultSelector: 'footer',
    },
    {
      class: 'RelatedArticlesRule',
      defaultSelector: 'ul.op-related-articles',
      properties: {
        'related.title': {
          label: 'Title',
          placeholder: 'Example: ul.op-related-articles',
          defaultAttribute: 'title',
        },
      },
    },
    {
      class: 'FooterRelatedArticlesRule',
      defaultSelector: 'ul.op-related-articles',
    },
  ],
};
