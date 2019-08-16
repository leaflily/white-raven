import React from 'react';
import Status from '../Modals/Status';
import Captcha from '../Components/Captcha';
import SendDirect from '../Components/SendDirect';
import './Submit.css';

class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.xhttp = null;
        this.data = props.data;
        this.tryCount = 0;
        this.timeout = null;
        this.state = {
            showSendDirect: false,
            showCaptcha: this.props.captcha || false,
            captchaInput: '',
            requireCaptchaInput: false,
            altProps: {
                name: 'retry',
                handler: this.retry
            },
            statusProps: {
                classNames: '',
                msg: '',
                alt: {
                    name: null,
                    handler: null
                },
                cancel: this.cancel
            }
        }
        this.statusMessages = {
            onTry: 'connecting',
            onUnableToConnect: 'Unable to connect',
            onUnableToSend: 'Something went wrong, is your email correct?'
        }
        props.hasOwnProperty('statusMessages') && Object.assign(this.statusMessages, props.statusMessages);
        this.retry = this.retry.bind(this);
        this.tryAgain = this.tryAgain.bind(this);
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this);
        this.handleCaptchaSubmit = this.handleCaptchaSubmit.bind(this);
        this.displaySendDirect = this.displaySendDirect.bind(this);
        this.disableBackground = this.disableBackground.bind(this);
        this.cancel = this.cancel.bind(this);
        this.resetLatch = this.resetLatch.bind(this);
        this.count = 0;
    }
    componentDidMount() {
        if (this.props.latch) {
            this.updateStatus()
            this.resetLatch();
        }
        else if (!this.props.captcha) {
            this.trySending()
        }
    }
    componentWillUnmount() {
        this.updateStatus(this.statusMessages.onTry, true);
        this.xhttp && this.xhttp.abort();
    }
    updateStatus(msg, spin, alt = { name: null, handler: null}, cancel = this.state.statusProps.cancel) {
        const classNames = spin ? '' : 'no-spin';
        this.setState({
            statusProps: {
                classNames,
                msg: msg,
                alt: alt,
                cancel: cancel
            }
        })
    }
    clearTimeouts = () => {
        clearTimeout(this.timeout);
    }
    unableToConnect = () => {
        if (this.tryCount < 5) {
            this.tryAgain();
        }
        else {
            this.updateStatus(this.statusMessages.onUnableToConnect, false, {name: 'Retry', handler: this.retry});
            this.clearTimeouts();
            this.xhttp && this.xhttp.abort();
        }
    }
    trySending = () => {
        this.sendData();
        this.timeout = setTimeout(() => {
            this.unableToConnect();
        }, 5000);
        this.updateStatus(this.statusMessages.onTry, true);
    }
    tryAgain = () => {
        this.updateStatus(this.statusMessages.onTry, true);
        this.clearTimeouts();
        this.timeout = setTimeout(() => {
            this.unableToConnect();
        }, 5000);
        this.tryCount++;
        this.sendData();
    }
    retry = () => {
        this.tryCount = 0;
        this.tryAgain();
    }
    cancel = () => {
        this.clearTimeouts();
        this.xhttp && this.xhttp.abort();
        this.props.cancel();
    }
    success = () => { 
        this.clearTimeouts();
        this.props.onSuccess(); 
    }
    sendData = () => {
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", this.props.url, true);
        this.xhttp.onreadystatechange = () => {
            console.log(this.status);
            if (this.readyState === 4 && this.status === 200) {
                this.success();
            }
            else if (this.status === 403) {
                this.handleCaptchaFail();
            }
            else if (this.status === 406) { 
                this.handleSendEmailFail();
            }
            else if (this.readyState === 0 || this.status === 404) {
                if (this.tryCount < 5) {
                    this.tryAgain()
                }
                else {
                    this.unableToConnect();
                } 
            }
        }
        this.xhttp.setRequestHeader("Content-type", "application/json");
        this.xhttp.send(JSON.stringify(this.data));
    }
    getStatusProps = () => this.state.statusProps;
    handleSendEmailFail = () => {
        this.updateStatus(this.statusMessages.onUnableToSend, false, {name: 'My email is correct', handler: this.displaySendDirect});
    }
    handleCaptchaFail = () => {
        this.setState({ showCaptcha: true });
    }
    handleCaptchaInput = e => {
        e.preventDefault();
        const input = e.target.value.replace(/\s/g, '');
        this.setState({ 
            captchaInput: input,
            requireCaptchaInput: false
        });
    }
    handleCaptchaSubmit = () => {
        if (this.state.captchaInput.match(/^[a-z]{3}$/ig)) {
            const newData = Object.assign({}, this.data, {captcha: this.state.captchaInput});
            this.data = newData;
            this.setState({ showCaptcha: false });
            this.trySending();
        }
        else {
            this.setState({
                requireCaptchaInput: true
            })
        }
    }
    getCaptchaProps = () => {
        return {
            handleInput: this.handleCaptchaInput,
            handleSumbit: this.handleCaptchaSubmit,
            requireInput: this.state.requireCaptchaInput
        }
    };
    displaySendDirect = () => {
        this.setState({ showSendDirect: true });
    }
    resetLatch = () => {
        fetch('/server/resetSendEmailLatch.php').then(() => {
            this.props.hasOwnProperty('statusMessages') && Object.assign(this.statusMessages, this.props.statusMessages);
            this.trySending();
        }).catch(() => {
            this.updateStatus(this.statusMessages.onUnableToConnect, false, {name: 'Retry', handler: this.resetLatch});
        });
    }
    disableBackground = () => {}
    render() {
        const display = this.state.showSendDirect ? <SendDirect data={JSON.stringify(this.data)} /> : this.state.showCaptcha ? <Captcha {...this.getCaptchaProps()} /> : <Status {...this.getStatusProps()} />;
        return <div onclick={this.disableBackground}><button className="submit__exit" aria-label="cancel" onClick={this.cancel}>X</button>{display}</div>
    }
}

export default Submit;