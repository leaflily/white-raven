import React, { useState, useRef, useEffect } from 'react'; 
import './Captcha.css';

function Captcha(props) {
    const [challenge, setChallenge] = useState(<img src={'/server/Captcha/captcha.php?'+Date.now()} alt="Please check you internet connection and try another" className="captcha__challenge__image" />);
    const [inputError, setInputError] = useState(false);
    const [input, setInput] = useState('');
    const inputRef = useRef(null)
    function refresh() {
        setChallenge(<img src={'/server/Captcha/captcha.php?'+Date.now()} alt="Please check you internet connection and try another" className="captcha__challenge__image" />);
    }
    function handlekeyPress(event) {
        setInputError(false);
        if (event.key === "Enter") {
            props.handleSumbit();
        }
        else {
            setInput(event.target.value.replace(/\s/g, ''));
        }
    }
    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    }, [challenge]);

    const handleSubmit = () => {
        if (input.match(/^[a-z]{3}$/ig)) {
            const data = {captcha: input};

            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", 'server/captcha_submit', true);
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) { 
                    // success 
                    props.handleCaptchaSuccess();
                }
                else if (this.status === 403) {
                    // fail
                    setInput('');
                    setInputError(true);
                }
                else if (this.readyState === 4) {
                    if (this.status == 0) { 
                        // client offline
                    }
                    else {
                        xhttp && xhttp.abort();
                        // server broken
                    }
                }
            }
            xhttp.send(JSON.stringify(data));
        }
        else {
            setInputError(true)
        }
    }

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
            <input ref={inputRef} onChange={handlekeyPress} className={inputError ? 'required' : ''} type="text" placeholder="e.g. XYZ" /><br />
            <div className="captcha__submit" onClick={handleSubmit}>send</div>
        </div>
    )
}

export default Captcha;