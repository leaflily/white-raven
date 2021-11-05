import React, {useEffect, useRef} from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Clouds from '../Components/Clouds';
import './Landing.css';


function Landing(props) {
    const start = useRef(null);
    useEffect(() => {
        document.title = 'Home  - White Raven';
        start.current.focus();
    }, []);
    return (
        <div tabIndex="-1" ref={start}>
                <Header page="landing" />
            <main>
                <Nav page="landing" />
                <Clouds />
            </main>
        </div>
    );
}

export default Landing;