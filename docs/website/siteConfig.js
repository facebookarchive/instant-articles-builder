/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  // {
  //   caption: 'User1',
  //   image: '/test-site/img/docusaurus.svg',
  //   infoLink: 'https://www.facebook.com',
  //   pinned: true,
  // },
];

const siteConfig = {
  title: 'Instant Articles Rules Editor' /* title for your website */,
  tagline: 'Configure your Instant Articles without coding',
  url: 'https://facebook.github.io' /* your website url */,
  baseUrl: '/facebook-instant-articles-rules-editor/',
  projectName: 'facebook-instant-articles-rules-editor',
  headerLinks: [
    {doc: 'get-started', label: 'Get Started'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#3b5998',
    secondaryColor: '#cccccc',
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Facebook',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  repoUrl: 'https://github.com/facebook/facebook-instant-articles-rules-editor',
};

module.exports = siteConfig;
