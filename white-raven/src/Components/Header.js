import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Quote from './Quote';
import './Header.css';
import logo from '../images/logo.png'

class Header extends React.Component {
    render() {
        return (
            <header role="banner" className={'header header--'+this.props.page}>
                <div className="header__logo">
                    <Link role="none" className="header__logo__a" to="/">
                        <img src={logo} className="header__logo__a__img" alt="White Raven." />
                    </Link>
                </div>
                {this.props.quote && <Quote quote={this.props.quote} /> }
            </header>
        )
    }
}

export default Header;