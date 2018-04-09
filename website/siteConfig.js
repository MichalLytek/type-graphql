/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  // {
  //   caption: "User1",
  //   image: "/type-graphql/img/docusaurus.svg",
  //   infoLink: "https://www.facebook.com",
  //   pinned: true,
  // },
];

const siteConfig = {
  title: "TypeGraphQL" /* title for your website */,
  tagline: "Modern framework for GraphQL API in Node.js",
  url: "https://19majkel94.github.io" /* your website url */,
  baseUrl: "/type-graphql/" /* base url for your project */,
  projectName: "type-graphql",
  headerLinks: [
    { doc: "introduction", label: "Docs" },
    // { doc: "doc4", label: "API" },
    // { href: "https://github.com/19majkel94/type-graphql/blob/master/examples", label: "Examples" },
    { doc: "examples", label: "Examples" },
    { doc: "faq", label: "FAQ" },
    { blog: true, label: "Blog" },
    { search: true },
    { href: "https://github.com/19majkel94/type-graphql", label: "GitHub" },
  ],
  algolia: {
    apiKey: "2cf66434100c0e30ca9ff499830e7b77",
    indexName: "typegraphql"
  },
  users,
  /* path to images for header/footer */
  headerIcon: "img/logo.png",
  footerIcon: "img/logo.png",
  favicon: "img/favicon.png",
  editUrl: "https://github.com/19majkel94/type-graphql/blob/master/docs/",
  /* colors for website */
  colors: {
    // primaryColor: '#2E8555',
    // primaryColor: "#2e6485",
    primaryColor: "#2e5985",
    // secondaryColor: '#205C3B',
    // secondaryColor: "#27526d",
    secondaryColor: "#26496d",
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: "Copyright © " + new Date().getFullYear() + " Michał Lytek",
  organizationName: "19majkel94", // or set an env variable ORGANIZATION_NAME
  projectName: "type-graphql", // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "androidstudio",
  },
  scripts: ["https://buttons.github.io/buttons.js"],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: "https://github.com/19majkel94/type-graphql",
  /* On page navigation for the current documentation page */
  onPageNav: "separate",
  gaTrackingId: "UA-117093147-1",
};

module.exports = siteConfig;
