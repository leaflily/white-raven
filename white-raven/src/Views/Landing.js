import React from 'react';
import Header from './Header';
import Nav from './Nav';
import './Landing.css';


class Landing extends React.Component {
    componentDidMount () {
        const script = document.createElement("script");
        script.src = "./clouds.js";
        script.async = true;
    
        document.body.appendChild(script);
    }
    render() {
        return (
            <>
                <Header page="landing" />
                <Nav page="landing" />
            </>
        );
    }
}

export default Landing;