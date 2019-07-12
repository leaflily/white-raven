import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Quote from './Quote';
import logo from './images/logo.png';
import './Header.css';

function Header(props) {
    return (
        <header className={'header header--'+props.page}>
            <div className="header__logo">
                <Link className="header__logo__a" to="/">
                    <img src={logo} className="header__logo__a__img" alt="logo" />
                </Link>
            </div>
            {props.quote && <Quote quote={props.quote} /> }
        </header>
    )
}

export default Header;