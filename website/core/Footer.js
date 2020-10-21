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
    
    <script
      dangerouslySetInnerHTML={{
        __html: `
                const html = document.querySelector("html");

                function appendButtonDOM() {
                  const li = document.createElement("li");
                  li.classList.add("center-list-item")
                  li.innerHTML = '<div class="toggle"><span>🌙</span><input type="checkbox" id="toggle-switch" /><label for="toggle-switch"><span class="screen-reader-text">Toggle Color Scheme</span></label><span>☀️</span></div>'

                  let nav = document.querySelector(".nav-site");
                  nav.insertBefore(li, document.querySelector(".navSearchWrapper"));

                  const btn = document.querySelector("#toggle-switch");
                  btn.addEventListener("click", () => {toggleColorMode()});
                }
                
                function setInitialColorMode() {
                  const currentColorMode = localStorage.getItem("theme");
                  const btn = document.querySelector("#toggle-switch");

                  if (currentColorMode === null) {
                    localStorage.setItem("theme", 0);
                    btn.checked = true;
                    return;
                  } else if(currentColorMode === "1") {
                    html.classList.add('theme-mode--dark');
                    btn.checked = false;
                  } else {
                    html.classList.add('theme-mode--light');
                    btn.checked = true;
                  }
                }
                
                function toggleColorMode() {
                  const btn = document.querySelector("#toggle-switch");
                  const currentColorMode = localStorage.getItem("theme");

                  if (currentColorMode === "1") {
                    localStorage.setItem("theme", 0);
                    btn.checked = true;
                  } else {
                    localStorage.setItem("theme", 1);
                    btn.checked = false;
                  }
                  
                  html.classList.toggle('theme-mode--dark');
                  html.classList.toggle('theme-mode--light');
                }

                appendButtonDOM();
                setInitialColorMode();
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
