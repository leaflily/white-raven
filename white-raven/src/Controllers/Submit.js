import React from 'react';
import Status from '../Modals/Status';
import Captcha from '../Components/Captcha';
import SendDirect from '../Components/SendDirect';
import SentToAdmin from '../Components/SentToAdmin';
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
                cancel: this.cancel,
                help: this.displaySendDirect
            },
            sentErrorToAdmin: false
        }
        this.clientError = false;
        this.statusMessages = {
            onTry: 'connecting',
            onUnableToConnect: 'Unable to connect',
            onUnableToSend: 'error'
        }
        props.hasOwnProperty('statusMessages') && Object.assign(this.statusMessages, props.statusMessages);
        this.retry = this.retry.bind(this);
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this);
        this.handleCaptchaSubmit = this.handleCaptchaSubmit.bind(this);
        this.displaySendDirect = this.displaySendDirect.bind(this);
        this.disableBackground = this.disableBackground.bind(this);
        this.cancel = this.cancel.bind(this);
        this.resetLatch = this.resetLatch.bind(this);
        this.count = 0;
        this.serverErrors = [];
        this.clientErrors = [];
        this.uploadingPhoto = this.data.hasOwnProperty('photoFile');
    }
    componentDidMount() {
        if (this.props.latch) {
            this.updateStatus();
            this.resetLatch();
        }
        else if (!this.props.captcha) {
            this.trySending();
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
        this.updateStatus(this.statusMessages.onUnableToConnect, false, {name: 'Retry', handler: this.retry});
        this.clearTimeouts();
        this.xhttp && this.xhttp.abort();
    }
    trySending = () => {
        if (this.clientError) {
            this.handleClientFail();
        }
        else {
            this.uploadingPhoto ? this.sendPhoto() : this.sendData();
        this.timeout = setTimeout(() => {
            this.unableToConnect();
        }, 300000);
        this.updateStatus(this.statusMessages.onTry, true);
        }
    }
    retry = () => {
        this.updateStatus(this.statusMessages.onTry, true);
        this.clearTimeouts();
        this.timeout = setTimeout(() => {
            this.unableToConnect();
        }, 300000);
        if (this.clientError) {
            this.handleClientFail();
        }
        else {
        this.uploadingPhoto ? this.sendPhoto() : this.sendData();
        }
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
    sendPhoto = () => {
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", '/server/photoUpload.php', true);
        const sumbit = this;
        this.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                sumbit.photoUploaded();
            }
            else if (this.status === 403) {
                sumbit.handleCaptchaFail();
            }
            else if (this.status >= 400 && this.status < 500) { 
                sumbit.handleClientFail(this.response);
            }
            else if (this.status >= 500) {
                sumbit.handleServerFail(this.response);
            }
        }
        var form_data = new FormData();
        const file = this.data.photoFile;
        form_data.append('photoFile', file, this.data.photoName);
        this.xhttp.send(form_data);
    }
    photoUploaded = () => {
        this.uploadingPhoto = false;
        this.resetLatch();
    }
    sendData = () => {
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", this.props.url, true);
        const sumbit = this;
        this.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                sumbit.success();
            }
            else if (this.status === 403) {
                sumbit.handleCaptchaFail();
            }
            else if (this.status >= 400 && this.status < 500) { 
                sumbit.handleClientFail(this.response);
            }
            else if (this.status >= 500) {
                sumbit.handleServerFail(this.response);
            }
        }
        this.xhttp.send(JSON.stringify(this.data));
    }
    getStatusProps = () => this.state.statusProps;
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
    handleClientFail = msg => {
        this.clientErrors.push(this.statusMessages.onUnableToSend);
        this.updateStatus(this.statusMessages.onUnableToSend+' '+msg+'. Darn, sorry we are having trouble processing your info. Emailing admin...', true);
        this.clientError = true;
        this.clearTimeouts();
        this.xhttp && this.xhttp.abort();
        this.resetLatch();
        this.emailAdmin(msg);
    };
    emailAdmin = msg => {
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", "/server/emailAdmin.php", true);
        const sumbit = this;
        this.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                sumbit.adminEmailed();
                sumbit.clientError = false;
            }
            else if (this.status === 403) {
                sumbit.handleCaptchaFail();
            }
            else {
                sumbit.displaySendDirect();
                sumbit.clearTimeouts();
                sumbit.xhttp && sumbit.xhttp.abort();
                sumbit.clientError = false;
            }
        }
        this.data.error = msg;
        this.xhttp.send(JSON.stringify(this.data));
    }
    adminEmailed = () => {
        this.setState({
            sentErrorToAdmin: true
        });
        this.clearTimeouts();
        this.xhttp && this.xhttp.abort();
    }
    handleServerFail = msg => {
        this.serverErrors.push(this.statusMessages.onUnableToSend);
        this.updateStatus(this.statusMessages.onUnableToSend+' '+msg+'. Woops, sorry somethings not working.', false, {name: 'Contact via email', handler: this.displaySendDirect});
        this.clearTimeouts();
        this.xhttp && this.xhttp.abort();
    };
    displaySendDirect = () => {
        this.setState({ showSendDirect: true });
    }
    resetLatch = () => {
        fetch('/server/resetSendEmailLatch.php').then((response) => {
            if (response.status === 403) {
                this.handleCaptchaFail();
            }
            else {
                this.props.hasOwnProperty('statusMessages') && Object.assign(this.statusMessages, this.props.statusMessages);
                this.trySending();
            }
        }).catch(() => {
            this.updateStatus("Sorry somethings not working", false, {name: 'Contact via email', handler: this.displaySendDirect});
        });
    }
    disableBackground = () => {}
    render() {
        const display = this.state.sentErrorToAdmin ? <SentToAdmin /> : this.state.showSendDirect ? <SendDirect data={JSON.stringify(this.data)} serverErrors={this.serverErrors} clientErrors={this.clientErrors} /> : this.state.showCaptcha ? <Captcha {...this.getCaptchaProps()} /> : <Status {...this.getStatusProps()} />;
        return <div onClick={this.disableBackground}><button className="submit__exit" aria-label="cancel" onClick={this.cancel}>X</button>{display}</div>
    }
}

export default Submit;