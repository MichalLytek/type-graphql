/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const DarkModeButton = () => {
  return (
    <>
    <div id="theme-mode-btn">
      Light Mode
    </div>
    <script
      dangerouslySetInnerHTML={{
        __html: `
                const btn = document.querySelector("#theme-mode-btn");
                const html = document.querySelector("html");
                
                function setInitialColorMode() {
                  const currentColorMode = localStorage.getItem("theme");
                  if (currentColorMode === null) {
                    localStorage.setItem("theme", 0);
                    return;
                  } else if(currentColorMode === "1") {
                    btn.classList.add('theme-mode-btn--dark');
                    html.classList.add('theme-mode--dark');
                    btn.textContent = "Light Mode";
                  } else {
                    btn.classList.add('theme-mode-btn--light');
                    html.classList.add('theme-mode--light');
                    btn.textContent = "Dark Mode";
                  }
                }
                
                function toggleColorMode() {
                  const currentColorMode = localStorage.getItem("theme");
                  if (currentColorMode === "1") {
                    localStorage.setItem("theme", 0);
                    btn.textContent = "Dark Mode";
                  } else {
                    localStorage.setItem("theme", 1);
                    btn.textContent = "Light Mode";
                  }
                  btn.classList.toggle('theme-mode-btn--dark');
                  btn.classList.toggle('theme-mode-btn--light');
                  html.classList.toggle('theme-mode--dark');
                  html.classList.toggle('theme-mode--light');
                }

                setInitialColorMode();
                btn.addEventListener("click", () => {toggleColorMode()});
                `
      }}
    />
    </>
  )
}

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
        <DarkModeButton />
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
            <a href={this.docUrl("introduction.html")}>Introduction</a>
            <a href={this.docUrl("getting-started.html")}>Getting Started</a>
            <a href={this.docUrl("scalars.html")}>Advanced Guides</a>
            <a href={this.docUrl("dependency-injection.html")}>Features</a>
            <a href={this.docUrl("emit-schema.html")}>Others</a>
            {/* <a href={this.docUrl('api.html')}>
              API Reference
            </a> */}
          </div>
          <div>
            <h5>Community</h5>
            {/* <a href={this.pageUrl('users.html')}>
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
              target="_blank"
            >
              Feature requests and proposals
            </a>
            <a
              href={
                this.props.config.repoUrl +
                '/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A"Bug+%3Abug%3A"'
              }
              target="_blank"
            >
              Issues
            </a>
            <a href="https://gitter.im/type-graphql/Lobby" target="_blank">
              Project Chat
            </a>
            <a href="https://twitter.com/typegraphql" target="_blank">
              Twitter
            </a>
            <a href="https://opencollective.com/typegraphql" target="_blank">
              Open Collective
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.baseUrl + "blog"}>Blog</a>
            <a href={this.props.config.repoUrl} target="_blank">
              GitHub
            </a>
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
