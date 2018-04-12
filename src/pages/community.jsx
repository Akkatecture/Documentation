import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import SEO from '../components/SEO/SEO';
import config from '../../data/SiteConfig';
import MainHeader from '../components/Layout/Header';
import About from '../components/About/About';

const BodyContainer = styled.div`
margin: 0 auto;
max-width: ${props => props.theme.contentWidthLaptop};
padding: ${props => props.theme.sitePadding};
@media (max-width: ${props => props.theme.widthLaptop}) {
  max-width: 95vw;
}
`;

class AboutPage extends React.Component {
  render () {
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <MainHeader
            siteTitle={config.siteTitle}
            siteDescription={config.siteDescription}
            location={this.props.location}
            logo={config.siteLogo}
          />
          <BodyContainer>
            <h1>Community</h1>
            <p>Akkatecture is developed in the open. Development activities are hosted on <a href='https://github.com/Lutando/Akkatecture'>github</a>. </p>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

export default AboutPage;
