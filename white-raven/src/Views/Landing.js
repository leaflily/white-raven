import React from 'react';
import Header from './Header';
import Nav from './Nav';
import Clouds from './Clouds';
import './Landing.css';


function Landing(props) {
    return (
        <>
            <Header page="landing" />
            <Nav page="landing" />
            <Clouds />
        </>
    );
}

export default Landing;