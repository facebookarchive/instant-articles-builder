/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
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
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
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
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <img width="632" height="373" src={imgUrl('print-overall.png')} />
          <h2 className="projectTitle">
            Instant Articles Builder
            <small>
              Set-up <a target="_blank" href="http://instantarticles.fb.com">
              Facebook Instant Articles</a> without coding
            </small>
          </h2>
          <PromoSection>
            <Button
              href={
                'http://github.com/facebook/' +
                'instant-articles-builder' +
                '/releases/latest'
              }
            >
              Download
            </Button>
            <Button href={docUrl('get-started.html', language)}>
              Get Started
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        title: 'Point & Click',
        content: 'Visually select elements from your website',
        image: imgUrl('print-point-and-click.png'),
        imageAlign: 'top',
      },
      {
        content: 'Preview the result as you go',
        image: imgUrl('print-preview.png'),
        imageAlign: 'top',
        title: 'Preview',
      },
      {
        title: 'Refine',
        content: 'Refine your configuration with CSS selectors',
        image: imgUrl('print-css.png'),
        imageAlign: 'top',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
