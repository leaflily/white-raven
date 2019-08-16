import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './Nav.css';

function Nav(props) {
    let links = [
        { page: 'communication', title: 'Animal Communication'},
        { page: 'about', title: 'About Me'},
        { page: 'reviews', title: 'Reviews'},
        { page: 'consultation', title: 'Consultation'}
    ];
    function sortedLinks() {
        if (props.page !== 'landing' && props.page !== 'communication') {
            const pageIndex = links.findIndex(link => link.page === props.page);
            const sortedLinks = links.slice(0);
            sortedLinks.splice(pageIndex, links.length-pageIndex);
            sortedLinks.unshift(...links.slice(pageIndex));
            return sortedLinks
        }
        else {
            return links
        }
    }
    return (
        <nav role="navigation" aria-label="Main Navigation" className={'nav nav--'+props.page}>
            {sortedLinks().map(link => <Link 
                key={link.page} 
                className={'nav__a nav__a--'+link.page} 
                to={'/'+link.page}>
                    {link.title}
                </Link>
            )}
        </nav>
    )
}

export default Nav;