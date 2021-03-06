/* eslint-disable no-undef */
import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
require('../../../node_modules/animate.css/animate.min.css');

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  background: ${props => props.isSubpage ? props.theme.brand : 'inherit'};        
  margin: ${props => props.isSubpage ? 'inherit' : '0 auto'};        
  .nav-link {
    font-size: 1.6rem;
    margin-right: 10px;
    font-weight: 200;           
    color: ${props => props.isSubpage ? props.theme.accent : props.theme.brand};      
  }  
  .nav-link:hover {
    border-color:  ${props => props.isSubpage ? props.theme.accent : props.theme.brand};
  }
`;
const Search = styled.div`
  position: relative;  
  input {
    display: absolute;
    font-size: 1.6rem;
    background: #2b303b;        
    color: ${props => props.isSubpage ? props.theme.accent : props.theme.brand};
    background: #fff9f9;
    border-color: ${props => props.isSubpage ? props.theme.accent : props.theme.brand};
    border-width: 1pt;
    border-style: solid;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    padding-top: 2.5pt;
    padding-bottom: 2.5pt;     
    margin-right: 10px;
    margin-top: 0px;
    z-index: 1;    
    text-indent: 20pt;
  }
  .icon {        
    height: 15pt;
    width: 15pt;
    padding: 2.5pt;
    left: 5pt;   
    right: 5pt;            
    top: 50%;
    transform: translate(0, -50%);
    position: absolute;       
    color: #4f5b66;
    z-index: 20000;
  }
`;

const Hamburger = styled.section`
  span {
    font-size: 2em;  
  }
  button {
    background: none;
    border: none;
    color:  ${props => props.theme.accent}; 
  }  
  
  button:active {
    background: #FFF0F;
  }
  
  border-radius: 50%;
  
  button {
    left: 0.25em;    
    bottom: 0.25em;
    padding: 0;
    width: 2.5em;
    height: 2.5em;
  }

  animation-delay: 350ms;
  .main {
    color:  ${props => props.theme.brand};
  }

  @media (min-width: ${props => props.theme.widthLaptop}) {
    display: none;    
  }
`;

const NavLinks = styled.section`
animation-delay: 350ms;
font-size: 2em;
display: inline-flex;
@media (max-width: ${props => props.theme.widthLaptop}) {
  display: ${(props) => props.menuOpen ? 'block' : 'none'};  
  width: 100%;
  padding-top: 12px;  
  text-align: left;  

  .language-divider {
    display: none;
  }
  .language-link-js:after {
    content: ' JAVASCRIPT DOCS';
  }
  .language-link-reason:after {
    content: ' REASON DOCS';
  }
}
`;

class Navigation extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { menuOpen: false, docSearchMounted: false };
  }
  mountDocsearch() {
  
    if (!this.state.docSearchMounted) {
      docsearch({
        apiKey: 'ae65d215a543e8083851249381e2f391',
        indexName: 'akkatecture',
        inputSelector: '#search-box',
        debug: false,       // Set debug to true if you want to inspect the dropdown,
        handleSelected: function(input, event, suggestion, datasetNumber, context) {
          // Do nothing if click on the suggestion, as it's already a <a href>, the
          // browser will take care of it. This allow Ctrl-Clicking on results and not
          // having the main window being redirected as well
          console.log(suggestion.url)
          if (context.selectionMethod === 'click') {
            window.location.replace(suggestion.url);
          }
      
          input.setVal('');
          window.location.replace(suggestion.url);
        },
        algoliaOptions: {
          attributesToRetrieve: ['*']
        }
      });
      this.setState({ docSearchMounted: true });
    }
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
  render() {
    return (
      <NavContainer isSubpage={this.props.isSubpage}>

        <section>
          {this.props.isSubpage
            ? <Link className='nav-link' to='/' ><img style={{ height: '1.5em' }} alt='logo' src='/logos/branding-inverted-1.svg' /></Link>
            : <Link className='nav-link' to='/' ><img style={{ height: '1.5em' }} alt='logo' src='/logos/branding.svg' /></Link>
          }
        </section>
        <Hamburger className={this.props.isSubpage ? ' ' : 'animated fadeIn'}>
          <button onClick={() => this.toggleMenu()} className={this.props.isSubpage ? 'subpage' : 'main'}>
            <span>{this.state.menuOpen ? '✕' : '☰'}</span>
          </button>
        </Hamburger>

        <NavLinks menuOpen={this.state.menuOpen} className={(this.props.isSubpage ? ' ' : 'animated fadeIn')}>
          {this.props.isSubpage && <Search>
            <img src='/img/search.svg' className='icon' />
            <input placeholder='search docs' type='search' ref={() => this.mountDocsearch()} className='search-box' id='search-box' />
          </Search>} 
          <div><Link className='nav-link' to='/docs/getting-started' > DOCS </Link></div>
          <div><Link className='nav-link' to='/blog' > BLOG </Link></div>
          <div><Link className='nav-link' to='/community' > COMMUNITY </Link></div>
          <div><a className='nav-link' target="_blank" href='https://github.com/Lutando/Akkatecture'> GITHUB </a></div>
        </NavLinks>
      </NavContainer>
    );
  }
}

export default Navigation;
