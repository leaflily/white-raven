import React, { useState, useRef, useEffect } from 'react'; 
import './Captcha.css';

function Captcha(props) {
    const [challenge, setChallenge] = useState(<img src={'/server/Captcha/captcha.php?'+Date.now()} alt="Please check you internet connection and try another" className="captcha__challenge__image" />);
    const input = useRef(null);
    function refresh() {
        setChallenge(<img src={'/server/Captcha/captcha.php?'+Date.now()} alt="Please check you internet connection and try another" className="captcha__challenge__image" />);
    }
    function handlekeyPress(event) {
        if (event.key === "Enter") {
            props.handleSumbit();
        }
    }
    useEffect(() => {
        input.current && input.current.focus();
    }, [challenge]);
    return (
        <div className="captcha">
            <h3>Captcha</h3>
            <div className="captcha__challenge">
                <div>
                    {challenge}
                </div>
                <div className="captcha__challenge__refresh" onClick={refresh}>try another</div>
            </div>
            <p className="captcha__info">Enter the three letters shown above to continue</p>
            <input ref={input} onKeyPress={handlekeyPress} className={props.requireInput ? 'required' : ''} type="text" placeholder="e.g. XYZ" onChange={props.handleInput} /><br />
            <div className="captcha__submit" onClick={props.handleSumbit}>send</div>
        </div>
    )
}

export default Captcha;