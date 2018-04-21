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
              <h2>Akkatecture is a software architecture toolkit.</h2>
              <p>With the notion of distributed computing becoming commonplace, so do our business domains need to become distributed.</p>
              <p>Akkatecture is built ontop of akka.net, and inspired by EventFlow. Akkatecture aims to make your business modelling easy, using actors:</p>
              <BenefitsList>
                <li><b>distributed.</b></li>
                <li><b>message based.</b></li>
                <li><b>event sourced.</b></li>
                <li><b>scaleable.</b></li>
              </BenefitsList>
              <p>Akkatecture treats event sourcing, and the axioms of the actor model as a primary fundamental concept. 
              </p>
              <p>Leveraging akka.net's well-thought out implementation, Akkatecture too enjoys great levels of extensibility and configurability for you to make a resilient, distributed application.</p>
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
              <p>Akkatecture is written in .net core targeting the netstandard 2.0 framework, using the greatest and latest open source technologies.</p>
              <p>If you are familiar with domain driven design, cqrs, and event sourcing, learning Akkatecture will be a breaze.</p>
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
