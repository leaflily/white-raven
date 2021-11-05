import React, {useRef} from 'react';
import './SendDirect.css';

function SendDirect(props) {
    const dataArea = useRef(null);
    const copyData = () => {
        dataArea.current.select();
       document.execCommand("copy");
    }
    return (
        <div className="send-direct">
            <h3>Sorry for this inconvenience</h3>
            <p className="send-direct__info">{props.log}<br /><br />
            If you could please copy and paste the following and then send it to the email below, that would be greatly appreciated:</p>
            <div className="send-direct__data">
                <div className="send-direct__data__copy" onClick={copyData}>copy</div>
                <textarea readOnly className="send-direct__data__text" ref={dataArea} value={props.data}></textarea>
                <div className="send-direct__data__email"><a href="mailto:white3raven@gmail.com" target="_top">white3raven@gmail.com</a></div>
            </div>
        </div>
    )
}

export default SendDirect;