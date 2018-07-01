/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + "docs/" + (language ? language + "/" : "") + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + "/" : "") + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("introduction.html", this.props.language)}>Introduction</a>
            <a href={this.docUrl("getting-started.html", this.props.language)}>Getting Started</a>
            <a href={this.docUrl("scalars.html", this.props.language)}>Advanced Guides</a>
            {/* <a href={this.docUrl('api.html', this.props.language)}>
              API Reference
            </a> */}
          </div>
          <div>
            <h5>Community</h5>
            {/* <a href={this.pageUrl('users.html', this.props.language)}>
              User Showcase
            </a> */}
            {/* <a
              href="http://stackoverflow.com/questions/tagged/type-graphql"
              target="_blank">
              Stack Overflow
            </a> */}
            <a
              href={
                this.props.config.repoUrl +
                '/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A"Enhancement+%3Anew%3A"'
              }
            >
              Feature requests and proposals
            </a>
            <a
              href={
                this.props.config.repoUrl +
                '/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A"Bug+%3Abug%3A"'
              }
            >
              Issues
            </a>
            <a href="https://gitter.im/type-graphql/Lobby">Project Chat</a>
            <a href="https://twitter.com/19majkel94" target="_blank">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.baseUrl + "blog"}>Blog</a>
            <a href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
