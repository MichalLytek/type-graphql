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
  <div className="project-logo">
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
        <div className="inner">
          <Logo img_src={imgUrl("logo.png")} />
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
  <Container
    padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
    className={props.className}
  >
    <GridBlock align={props.align || "center"} contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn" className="highlight features-section">
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

const objectTypeSnippet = fs
  .readFileSync(process.cwd() + "/pages/snippets/object-type.md")
  .toString();
const DefineSchemaSection = props => (
  <Container
    id="define-schema"
    padding={["bottom", "top"]}
    background="light"
    className="snippet-container highlight"
  >
    <GridBlock
      align="left"
      contents={[
        {
          title: "Define schema",
          content:
            "Use only classes and decorators to define your GraphQL schema. No need to define types in SDL and no need to create interfaces for them!<br><br>This way you will have only one source of truth, so say goodbye to all field type mismatches, typos and annoying refactoring.",
        },
      ]}
    />
    <div className="snippet">
      <MarkdownBlock>{objectTypeSnippet}</MarkdownBlock>
    </div>
  </Container>
);

const testabilitySnippet = fs
  .readFileSync(process.cwd() + "/pages/snippets/testability.md")
  .toString();
const ResolversSection = props => (
  <Container id="validation" padding={["bottom", "top"]} className="snippet-container">
    <div className="snippet">
      <MarkdownBlock>{testabilitySnippet}</MarkdownBlock>
    </div>
    <GridBlock
      align="left"
      contents={[
        {
          title: "Create resolvers",
          content:
            "Implement queries and mutations as normal class methods! Dependency injection support and decorators abstraction provides great separation of business logic from the underlying transport layer.<br><br>That gives you really easy testability, so you can just provide mocks of dependencies to prevent side effects and unit test your resolvers like a simple services which methods only take some parameters and return results.",
        },
      ]}
    />
  </Container>
);

const validationSnippet = fs
  .readFileSync(process.cwd() + "/pages/snippets/validation.md")
  .toString();
const Validation = props => (
  <Container
    id="validation"
    padding={["bottom", "top"]}
    className="snippet-container highlight"
    background="light"
  >
    <GridBlock
      align="left"
      contents={[
        {
          title: "Easy validation",
          content:
            "Forget about manual inputs and arguments validation! No need to create custom scalars to limit the length of a string or the range of an int.<br><br>Just use decorators from <a href='https://github.com/typestack/class-validator' target='_blank'>class-validator</a> library and declare the requirements of the inputs. It couldn't be easier!",
        },
      ]}
    />
    <div className="snippet">
      <MarkdownBlock>{validationSnippet}</MarkdownBlock>
    </div>
  </Container>
);

const typeormSnippet = fs.readFileSync(process.cwd() + "/pages/snippets/typeorm.md").toString();
const InteroperableSection = props => (
  <Container id="interoperable" padding={["bottom", "top"]} className="snippet-container">
    <div className="snippet">
      <MarkdownBlock>{typeormSnippet}</MarkdownBlock>
    </div>
    <GridBlock
      align="left"
      contents={[
        {
          title: "Interoperable",
          content:
            "Although TypeGraphQL is data-layer library agnostic, it integrates well with other decorator-based libraries, like [TypeORM](https://github.com/typeorm/typeorm), [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) or [Typegoose](https://github.com/typegoose/typegoose).<br><br>This allows you to define both the GraphQL type and the entity in a single class - no need to jump between multiple files to add or rename some properties.",
        },
      ]}
    />
  </Container>
);

const CollectiveSection = props => (
  <React.Fragment>
    <Container id="collective" padding={["top"]} className="snippet-container highlight">
      <GridBlock
        align="left"
        contents={[
          {
            title: "Community supported",
            content:
              "TypeGraphQL is an MIT-licensed open source project. It doesn't have a large company that sits behind - its ongoing development is possible only thanks to the support by the community.<br><br>If you fell in love with TypeGraphQL, please consider supporting our efforts and help it grow, especially if you are using it commercially - just to ensure that the project which your product relies on is actively maintained and improved.",
          },
        ]}
      />
      <div className="collective-button">
        <a href="https://opencollective.com/typegraphql">
          <img
            srcSet="https://opencollective.com/typegraphql/donate/button.png?color=blue, https://opencollective.com/typegraphql/donate/button@2x.png?color=blue 2x"
            src="https://opencollective.com/typegraphql/donate/button.png?color=blue"
          />
        </a>
      </div>
    </Container>
    <div id="sponsors" className="snippet-container">
      <div className="wrapper">
        <h3 className="title">Gold Sponsors 🏆</h3>
        <blockquote className="note">
          <span>Please ask your company to support this open source project by</span>{" "}
          <a href="https://opencollective.com/typegraphql/contribute/gold-sponsors-8340">
            becoming a gold sponsor
          </a>{" "}
          <span>and getting a premium technical support from our core contributors.</span>
        </blockquote>
        <h3 className="title">Silver Sponsors 🥈</h3>
        <div className="tiles">
          <a href="https://leofame.com/buy-instagram-followers" target="_blank" rel="sponsored">
            <img src={imgUrl("leofame.png")} style={{ width: 250 }} />
            <span>Leofame</span>
          </a>
        </div>
        <h3 className="title">Bronze Sponsors 🥉</h3>
        <div className="tiles">
          <a href="https://www.ligrsystems.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("live-graphics-system.png")} style={{ width: 55 }} />
            <span>Live Graphic Systems</span>
          </a>
          <a href="https://www.joinlifex.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("lifex.svg")} style={{ width: 60 }} />
            <span>LifeX Aps</span>
          </a>
          <a href="https://instinctools.com/manufacturing/" target="_blank" rel="sponsored">
            <img src={imgUrl("instinctools.svg")} style={{ width: 100 }} />
            <span>*instinctools</span>
          </a>
          <a href="https://strands-hint.net" target="_blank" rel="sponsored">
            <img src={imgUrl("strands-hint-logo.svg")} style={{ width: 80 }} />
            <span>Strands Hint</span>
          </a>
          <a
            href="https://play-fortune.pl/gry-online/jednoreki-bandyta/"
            target="_blank"
            rel="sponsored"
          >
            <img src={imgUrl("play_fortune.png")} style={{ width: 80 }} />
            <span>Play Fortune</span>
          </a>
          <a
            href="https://www.fansoria.com/instagram-marketing/buy-instagram-followers/"
            target="_blank"
            rel="sponsored"
          >
            <img src={imgUrl("fansoria.png")} style={{ width: 45 }} />
            <span>Fansoria</span>
          </a>
        </div>
        <div className="tiles">
          <a href="https://guidebook.betwinner.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("betwinner.svg")} style={{ width: 100 }} />
            <span>BetWinner</span>
          </a>
          <a href="https://www.famety.com/buy-instagram-likes" target="_blank" rel="sponsored">
            <img src={imgUrl("famety.png")} style={{ width: 40 }} />
            <span>Famety</span>
          </a>
          <a href="https://buzzvoice.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("logo-buzzv.png")} style={{ width: 70 }} />
            <span>BuzzVoice</span>
          </a>
          <a href="https://www.socialwick.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("socialwick-logo.png")} style={{ width: 50 }} />
            <span>SocialWick</span>
          </a>
          <a href="https://www.c19.cl/" target="_blank" rel="sponsored">
            <img src={imgUrl("c19.png")} style={{ width: 50 }} />
            <span>C19</span>
          </a>
          <a href="https://novecasino.net/" target="_blank" rel="sponsored">
            <img src={imgUrl("nove_casino.svg")} style={{ width: 70 }} />
            <span>Nove Casino</span>
          </a>
          <a href="https://zahranicnicasino.net/" target="_blank" rel="sponsored">
            <img src={imgUrl("zahranicnicasino.svg")} style={{ width: 90 }} />
            <span>Zahranicni Casino</span>
          </a>
          <a href="https://kaszinomagyar.net/" target="_blank" rel="sponsored">
            <img src={imgUrl("kaszinomagyar.svg")} style={{ width: 90 }} />
            <span>Casino Magyar</span>
          </a>
        </div>
        <div className="tiles">
          <a href="https://sidesmedia.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("sidesmedia.png")} style={{ width: 40 }} />
            <span>SidesMedia</span>
          </a>
          <a
            href="https://www.socialfollowers.uk/buy-tiktok-followers/"
            target="_blank"
            rel="sponsored"
          >
            <img src={imgUrl("social_followers.png")} style={{ width: 60 }} />
            <span>Social Followers</span>
          </a>
          <a href="https://igcomment.com/buy-instagram-comments/" target="_blank" rel="sponsored">
            <img src={imgUrl("ig-comment.png")} style={{ width: 80 }} />
            <span>IG Comment</span>
          </a>
          <a href="https://twicsy.com/buy-instagram-followers" target="_blank" rel="sponsored">
            <img src={imgUrl("twicsy.svg")} style={{ width: 100 }} />
            <span>Twicsy</span>
          </a>
          <a href="https://buzzoid.com/buy-instagram-followers/" target="_blank" rel="sponsored">
            <img src={imgUrl("buzzoid.svg")} style={{ width: 90 }} />
            <span>Buzzoid</span>
          </a>
          <a
            href="https://www.reddit.com/r/TikTokExpert/comments/1f812o7/best_and_cheapest_site_to_buy_tiktok_followers/"
            target="_blank"
            rel="sponsored"
          >
            <img src={imgUrl("tiktok-expert.jpg")} style={{ width: 60 }} />
            <span>TikTok Expert</span>
          </a>
          <a href="https://views4you.com/" target="_blank" rel="sponsored">
            <img src={imgUrl("v4u.png")} style={{ width: 90 }} />
            <span>Views4You</span>
          </a>
        </div>
        <h3 className="title">Members 💪</h3>
        <a href="https://opencollective.com/typegraphql#contributors">
          <img src="https://opencollective.com/typegraphql/tiers/members.svg?avatarHeight=45&width=320&button=false" />
        </a>
        <h3 className="title">GitHub Sponsors 🐙</h3>
        <a href="https://github.com/sponsors/TypeGraphQL">
          <img src={imgUrl("github-sponsors.svg")} />
        </a>
      </div>
    </div>
  </React.Fragment>
);

const WantMoreSection = props => {
  let language = props.language || "";
  return (
    <div className="want-more-section">
      <div className="productShowcaseSection" style={{ textAlign: "center" }}>
        <h2>Want more?</h2>
        That was only a tip of the iceberg. Interested?
        <br />
        Give it a try and experiment with TypeGraphQL! It will reduce your codebase size by a half
        or more!
        <br />
      </div>
      <div className="want-more-buttons">
        <Button href={docUrl("getting-started.html", language)}>Getting started</Button>
        <Button href={docUrl("examples.html", language)}>Examples</Button>
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
          <DefineSchemaSection />
          <ResolversSection />
          <Validation />
          <InteroperableSection />
          <CollectiveSection />
          <WantMoreSection language={language} />
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
