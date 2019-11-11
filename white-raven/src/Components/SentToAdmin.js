import React from 'react';
import './SendDirect.css';

function SentToAdmin(props) {
    return (
        <div className="send-direct">
            <h3>Sorry for this inconvenience</h3>
            <p className="send-direct__info">I'm not able to recieve your info through the system some reason. <br /><br />
                The site admin has been emailed. So should be able to sort things out soon. <br /><br />
                <div className="send-direct__data__email"><a href="mailto:woops@white-raven.co.uk" target="_top">woops@white-raven.co.uk</a></div>
            </p>
        </div>
    )
}

export default SentToAdmin;