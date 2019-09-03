import React, { useState, useRef, useEffect} from 'react';
import Spinner from '../Components/Spinner';
import Status from '../Modals/Status';
import './Paypal.css';

function Paypal(props) {
    const paypalRef = useRef();
    const [buttonLoaded, setButtonLoaded] = useState(false);
    const [showTimeoutStatus, setShowTimeoutStatus] = useState(false);
    const tryLoadButton = () => {
        if (window.paypal) {
            loadButton();
        }
        else if (tryCount > 100) {
            setShowTimeoutStatus(true);
        }
        else {
            setTimeout(() => {   
                tryCount++;
                tryLoadButton();
            }, 100);
        }
    };
    const reTryLoadButton = () => {
        setShowTimeoutStatus(false);
        tryLoadButton();
    }
    const statusProps = {
        classNames: 'no-spin',
        msg: 'Unable to connect. Please check your internet connection and try again.',
        alt: {
            name: 'Retry',
            handler: reTryLoadButton
        },
        cancel: props.cancel
    };
    var tryCount = 0;
    const loadButton = () => {
            setButtonLoaded(true);
            window.paypal
                .Buttons({
                    // Set up the transaction
                    createOrder: function(data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '0.01'
                                }
                            }]
                        });
                    },
                
                    // Finalize the transaction
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            props.payed(details);
                        });
                    },

                    onError: function(err) {
                        console.log(err);
                    }
            
            }).render(paypalRef.current);
    }
    useEffect(tryLoadButton, [paypalRef]);
    const noSpinClass = showTimeoutStatus ? 'no-spin' : '';
    return (<>
        {showTimeoutStatus && <Status {...statusProps} />}
        <div className="modal__booking-stage__form__payment-button" ref={paypalRef} id="paypalButton">
            {!buttonLoaded && <div className={'paypal__spinner '+noSpinClass}><Spinner /></div>}
        </div>
    </>)
}

export default Paypal;