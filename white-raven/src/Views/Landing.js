import React from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Clouds from '../Components/Clouds';
import './Landing.css';


function Landing(props) {
    return (
        <>
                <Header page="landing" />
            <main>
                <Nav page="landing" />
                <Clouds />
            </main>
        </>
    );
}

export default Landing;