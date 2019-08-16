import React, { useState } from 'react'; 
import './Captcha.css';

function Captcha(props) {
    const [challenge, setChallenge] = useState('');
    function refresh() {
        fetch('/server/Captcha/captcha.php').then(img => setChallenge(img.default));
    }
    refresh();
    return (
        <div className="captcha">
            <h3>Captcha</h3>
            <div className="captcha__challenge">
                <div>
                    <img src={challenge} alt="CAPTCHA" class="captcha__challenge__image"></img>
                </div>
                <div className="captcha__challenge__refresh" onClick={refresh}>try another</div>
            </div>
            <p className="captcha__info">Enter the three letters shown above to continue</p>
            <input className={props.requireInput ? 'required' : ''} type="text" placeholder="e.g. XYZ" onChange={props.handleInput} /><br />
            <div className="captcha__submit" onClick={props.handleSumbit}>send</div>
        </div>
    )
}

export default Captcha;