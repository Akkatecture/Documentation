import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Link from 'gatsby-link';
import SEO from '../components/SEO/SEO';
import config from '../../data/SiteConfig';
import MainHeader from '../components/Layout/Header';
import CtaButton from '../components/CtaButton';

class Index extends React.Component {
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <SEO postEdges={postEdges} />
        <main style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{flex: 1, minHeight: '65vh'}}>
            <MainHeader
              siteTitle={config.siteTitle}
              siteDescription={config.siteDescription}
              location={this.props.location}
              logo={config.siteLogo}
          />
          </span>
          <BodyContainer>
            <BodyContents>
              <h2>Akkatecture is a CQRS/ES toolkit for Akka.NET</h2>
              <p>With the notion of distributed computing becoming commonplace, so do our business domains need to become distributed.</p>
              <p>Akkatecture, built ontop of Akka.NET, and inspired by EventFlow, aims to make your business modelling easy, using actors:</p>
              <BenefitsList>
                <li>Based purely on fire and forget semantics making it reactive.</li>
                <li>Event sourced, giving you audit trails and long term business value.</li>
                <li>Highly configurable and extensible.</li>
                <li>Scales well backed with Akka.NET's clustering mechanism.</li>
                <li>Sagas give you the ability to craft long running persistent processes easily.</li>
              </BenefitsList>
              <p>Akkatecture treats event sourcing as a fundamental principle making it a great canditate to use in conjunction with long running projects
              </p>
              <p>Leveraging Akka.NET's well-thought out architectural implementations, Akkatecture too enjoys great levels of extensibility and configurability for you to make a resilient, distributed application</p>
            </BodyContents>
          </BodyContainer>
          <BodyContainerInverted>
            <BodyContentsInverted>
              <h2>Getting Started</h2>
              <p>Akkatecture is written in C# .NET Core targeting the netstandard 2.0 framework, which means that for any greenfield project, this may be a good option for you to consider.</p>
              <p>If you are familiar with domain driven design, CQRS, and event sourcing, learning Akkatecture will be a breaze for you to pick up.</p>
              <div> 
                <CtaButton  to={'/lesson/akkatecture/getting-started'}> GET STARTED</CtaButton>
              </div>
              
            </BodyContentsInverted>
          </BodyContainerInverted>
        </main>
      </div>
    );
  }
}

export default Index;

const BenefitsList = styled.ul`
  list-style-type: '✔ ';       
  li { 
    padding-right: 25px;
  }
`;

const BodyContainer = styled.div`
  padding: ${props => props.theme.sitePadding};  
  background: ${props => props.theme.brand};    
`;

const BodyContainerInverted = styled.div`
padding: ${props => props.theme.sitePadding};  
padding-bottom: 16rem;
`;

const BodyContents = styled.div`
margin: 0 auto;
max-width: ${props => props.theme.contentWidthLaptop};
color:  ${props => props.theme.accent};
`;

const BodyContentsInverted = styled.div`
margin: 0 auto;
max-width: ${props => props.theme.contentWidthLaptop};
`;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges { 
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
          }
        }
      }
    }
  }
`;
