import React from 'react';

class Paypal extends React.Component {
    constructor(props) {
        super(props);
        this.script = document.createElement("script");
    }
    componentDidMount () {
        this.script.src = "/paypalbtns.js";
        this.script.async = true;
        document.body.appendChild(this.script);
    }
    componentWillUnmount() {
        document.body.removeChild(this.script);
    }
    render() {
        return (
            <div className="modal__booking-stage__form__payment-button" id="paypal-button-container"></div>
        )
    }
}

export default Paypal;
