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
          <span style={{flex: 1, minHeight: '45vh'}}>
            <MainHeader
              siteTitle={config.siteTitle}
              siteDescription={config.siteDescription}
              location={this.props.location}
              logo={config.siteLogo}
          />
          </span>
          <BodyContainer>
            <BodyContents>
              <h2>Akkatecture is a cqrs and event sourcing framework for dotnet core.</h2>
              <p>Akkatecture is an open source framework for building reactive microservice systems. Akkatecture is built ontop of akka.net and the principles of the actor model. The framework subscribes to the tenets of cqrs and message passing so that you can be sure that your application is:</p>
              <BenefitsList>
                <li><b>reactive.</b></li>
                <li><b>distributed.</b></li>
                <li><b>event sourced.</b></li>
                <li><b>scaleable.</b></li>
              </BenefitsList>
              <p>Akkatecture treats event sourcing, and the axioms of the actor model as a primary fundamental concept. As a result of being built ontop of akka.net, Akkatecture also enjoys great levels of extensibility, and configurability, so that you can make a resilient, distributed application.</p>
            </BodyContents>
          </BodyContainer>
         { /*<BodyContainerInverted>
            <div className="gatsby-highlight">

            <pre className="language-csharp">
            <code class="language-csharp">
            </code>
            </pre>

            </div>
         </BodyContainerInverted> */}
          <BodyContainerInverted>
            <BodyContentsInverted>
              <h2>Getting Started</h2>
              <p>Akkatecture is written in .net core targeting the netstandard 2.0 framework, while also using the greatest and latest open source dotnet core technologies.</p>
              <p>If you are familiar with domain driven design, cqrs, and event sourcing, then learning Akkatecture will be a breaze. If you are not, don't worry, why not learn these concepts while using Akkatecture through our walkthrough style tutorial in our documentation.</p>
              <p>This project comes complete with documentation that covers the concepts and constructs that it employs.</p>
              <div> 
                <CtaButton  to={'/docs/getting-started'}> GET STARTED</CtaButton>
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
