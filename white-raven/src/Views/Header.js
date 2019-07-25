import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Quote from './Quote';
import './Header.css';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logo: ''
        }
        
    }
    componentWillMount() {
        import(`./images/logo.png`).then(img => this.setState({
            logo: img.default
        }))
    }
    render() {
        return (
            <header className={'header header--'+this.props.page}>
                <div className="header__logo">
                    <Link className="header__logo__a" to="/">
                        <img src={this.state.logo} className="header__logo__a__img" alt="logo" />
                    </Link>
                </div>
                {this.props.quote && <Quote quote={this.props.quote} /> }
            </header>
        )
    }
}

export default Header;