/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
const fs = require("fs");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
  return siteConfig.baseUrl + "img/" + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self",
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <SplashContainer>
        <Logo img_src={imgUrl("logo.png")} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("introduction.html", language)}>Introduction</Button>
            <Button href={docUrl("getting-started.html", language)}>Getting started</Button>
            <Button href={docUrl("examples.html", language)}>Examples</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container padding={["bottom", "top"]} id={props.id} background={props.background}>
    <GridBlock align={props.align || "center"} contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        image: imgUrl("GraphQL_Logo.svg"),
        imageAlign: "top",
        title: "GraphQL",
        content:
          "Define your whole schema, including types, interfaces, enums, unions and subscriptions",
      },
      {
        image: imgUrl("ts-logo.png"),
        imageAlign: "top",
        title: "TypeScript",
        content:
          "Create the schema, types and resolvers only with TypeScript, using classes and decorators! ",
      },
      {
        image: imgUrl("tools.svg"),
        imageAlign: "top",
        title: "Advanced features",
        content:
          "Use features like automatic validation, authorization guards, dependency injection and plenty more...",
      },
    ]}
  </Block>
);

// const FeatureCallout = props => (
//   <div className="productShowcaseSection paddingBottom" style={{ textAlign: "center" }}>
//     <h2>Feature Callout</h2>
//     <MarkdownBlock>These are features of this project</MarkdownBlock>
//   </div>
// );

const typeormSnippet = fs.readFileSync(process.cwd() + "/static/snippets/typeorm.md").toString();
const Interoperable = props => (
  <Container
    id="interoperable"
    padding={["bottom", "top"]}
    background="light"
    className="snippet-container"
  >
    <GridBlock
      align="left"
      contents={[
        {
          title: "Interoperable",
          content:
            "Although TypeGraphQL is data-layer library agnostic, it integrates well with other decorator-based libraries, like [TypeORM](https://github.com/typeorm/typeorm), [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) or [Typegoose](https://github.com/szokodiakos/typegoose).<br><br>This allows you to define both the GraphQL type and the entity in a single class - no need to jump between multiple files to add or rename some properties.",
        },
      ]}
    />
    <div className="snippet">
      <MarkdownBlock>{typeormSnippet}</MarkdownBlock>
    </div>
  </Container>
);

const validationSnippet = fs
  .readFileSync(process.cwd() + "/static/snippets/validation.md")
  .toString();
const Validation = props => (
  <Container id="validation" padding={["bottom", "top"]} className="snippet-container">
    <div className="snippet">
      <MarkdownBlock>{validationSnippet}</MarkdownBlock>
    </div>
    <GridBlock
      align="left"
      contents={[
        {
          // image: imgUrl("validation.png"),
          // imageAlign: "left",
          title: "Validation",
          content:
            "Forget about manual inputs and arguments validation! No need to create custom scalars to limit the length of a string or a int range.<br><br>Just use decorators from <a href='https://github.com/typestack/class-validator' target='_blank'>class-validator</a> library and declare the requirements of the inputs. It couldn't be easier!",
        },
      ]}
    />
  </Container>
);

const testabilitySnippet = fs
  .readFileSync(process.cwd() + "/static/snippets/testability.md")
  .toString();
const Testability = props => (
  <Container
    id="validation"
    padding={["bottom", "top"]}
    background="light"
    className="snippet-container"
  >
    <GridBlock
      align="left"
      contents={[
        {
          // image: imgUrl("testability.png"),
          // imageAlign: "right",
          title: "Easy testability",
          content:
            "Dependency injection support and decorators abstraction gives a great separation of business logic from the underlying transport layer.<br><br>Thanks to this, you can easily mock the dependencies to prevent side effects and unit test your resolvers like a simple services that only takes some inputs and returns result.",
        },
      ]}
    />
    <div className="snippet">
      <MarkdownBlock>{testabilitySnippet}</MarkdownBlock>
    </div>
  </Container>
);

const WantMore = props => {
  let language = props.language || "";
  return (
    <div className="want-more-section">
      <div className="productShowcaseSection" style={{ textAlign: "center" }}>
        <h2>Want more?</h2>
        That was only a tip of the iceberg. Interested?<br />
        Give it a try and experiment with TypeGraphQL! It will reduce your codebase size by a half
        or more!
        <br />
      </div>
      <div className="want-more-buttons">
        {/* <PromoSection> */}
        <Button href={docUrl("getting-started.html", language)}>Getting started</Button>
        <Button href={docUrl("examples.html", language)}>Examples</Button>
        {/* </PromoSection> */}
      </div>
    </div>
  );
};

// const Showcase = props => {
//   if ((siteConfig.users || []).length === 0) {
//     return null;
//   }
//   const showcase = siteConfig.users
//     .filter(user => {
//       return user.pinned;
//     })
//     .map((user, i) => {
//       return (
//         <a href={user.infoLink} key={i}>
//           <img src={user.image} title={user.caption} />
//         </a>
//       );
//     });

//   return (
//     <div className="productShowcaseSection paddingBottom">
//       <h2>{"Who's Using This?"}</h2>
//       <p>This project is used by all these people</p>
//       <div className="logos">{showcase}</div>
//       <div className="more-users">
//         <a className="button" href={pageUrl("users.html", props.language)}>
//           More {siteConfig.title} Users
//         </a>
//       </div>
//     </div>
//   );
// };

class Index extends React.Component {
  render() {
    let language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          {/* <FeatureCallout /> */}
          <Interoperable />
          <Validation />
          <Testability />
          <WantMore language={language} />
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
