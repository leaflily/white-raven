import React from 'react';
import Header from './Header';
import Nav from './Nav';
import './Landing.css';
import '../clouds.css';


class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.script = document.createElement("script");
    }
    componentDidMount () {
        this.script.src = "./clouds.js";
        this.script.async = true;
        document.body.appendChild(this.script);
    }
    componentWillUnmount() {
        document.body.removeChild(this.script);
    }
    render() {
        return (
            <>
                <Header page="landing" />
                <Nav page="landing" />
                <div id="viewport">
                    <div id="world">

                    </div>
                </div>
            </>
        );
    }
}

export default Landing;