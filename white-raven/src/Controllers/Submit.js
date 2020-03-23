import React from 'react';
import Status from '../Modals/Status';
import Captcha from '../Components/Captcha';
import SendDirect from '../Components/SendDirect';
import './Submit.css';

class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
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
        this.resultLog = [];
        this.clientError = false;
        this.statusMessages = {
            onTry: 'connecting',
            onUnableToConnect: 'Unable to connect',
            onUnableToSend: 'error'
        }
        props.hasOwnProperty('statusMessages') && Object.assign(this.statusMessages, props.statusMessages);
        this.handleCaptchaInput = this.handleCaptchaInput.bind(this);
        this.handleCaptchaSubmit = this.handleCaptchaSubmit.bind(this);
        this.displaySendDirect = this.displaySendDirect.bind(this);
        this.disableBackground = this.disableBackground.bind(this);
        this.cancel = this.cancel.bind(this);
        this.count = 0;
        this.serverErrors = [];
        this.clientErrors = [];
        this.uploadingPhoto = this.data.hasOwnProperty('photoFile');
    }
    componentDidMount() {
        if (!this.props.captcha) {
            this.trySending();
        }
    }
    componentWillUnmount() {
        
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

    /* captcha */
    handleCaptchaFail = () => {
        this.updateStatus('Captcha Fail', false);
        this.setState({ 
            showCaptcha: true, 
            captchaInput: '' 
        });
    }
    handleCaptchaInput = e => {
        e.preventDefault();
        const input = e.target.value.replace(/\s/g, '');
        this.setState({ 
            captchaInput: input,
            requireCaptchaInput: true
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


    trySending = () => {
        const newData = Object.assign({}, this.data, {timeStamp: Date.now()});
        this.data = newData;
        this.uploadingPhoto ? this.sendPhoto(this) : this.sendData(this);
    }
    sendPhoto = (thisSelf) => {
        this.updateStatus('Uploading your photo', true);
        const done = () => {
            clearTimeout(timeOut);
            thisSelf.uploadingPhoto = false;
            thisSelf.trySending();
        }
        const failed = () => {
            thisSelf.xhttp && thisSelf.xhttp.abort();
            clearTimeout(timeOut);
            thisSelf.resultLog.push('Your photo was unable to upload, but we can sort this out later via email.');
            done();
        }
        let timeOut = setTimeout(() => {
            failed();
        }, 15000); // 15 seconds
        thisSelf.xhttp = new XMLHttpRequest();
        thisSelf.xhttp.open("POST", '/server/photoUpload.php', true);
        thisSelf.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                done();
            }
            else if (this.status === 403) {
                clearTimeout(timeOut);
                thisSelf.handleCaptchaFail();
            }
            else if (this.readyState === 4) { 
                failed();
            }
        }
        var form_data = new FormData();
        const file = thisSelf.data.photoFile;
        if (file) {
            form_data.append('photoFile', file, thisSelf.data.photoName);
        } 
        else {
            delete thisSelf.data.photoName;
        }
        thisSelf.xhttp.send(form_data); 
    }

    sendData = (thisSelf) => {
        this.updateStatus('Uploading your info', true);
        const done = () => {
            clearTimeout(timeOut);
            thisSelf.success();
        }
        const failed = () => {
            this.xhttp && this.xhttp.abort();
            thisSelf.resultLog.push('Unable to send your info. Sorry about this somethings not working right now.');
            thisSelf.failedToSend();
        }
        let timeOut = setTimeout(() => {
            failed();
        }, 15000); // 15 seconds
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", this.props.url, true);
        this.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) { 
                done();
            }
            else if (this.status === 403) {
                thisSelf.handleCaptchaFail();
            }
            else if (this.readyState === 4) {
                failed();
            }
        }
        this.xhttp.send(JSON.stringify(this.data));
    }

    cancel = () => {
        this.xhttp && this.xhttp.abort();
        this.props.cancel();
    }
    success = () => { 
        this.props.onSuccess(); 
    }
    photoUploaded = () => {
        this.uploadingPhoto = false;
    }
    failedToSend = () => {
        this.displaySendDirect();
    }
    displaySendDirect = () => {
        this.setState({ showSendDirect: true });
    }
    disableBackground = () => {}

    render() {
        const display = this.state.showSendDirect ? <SendDirect data={JSON.stringify(this.data)} log={this.resultLog} /> : this.state.showCaptcha ? <Captcha {...this.getCaptchaProps()} /> : <Status {...this.state.statusProps} />;
        return <div onClick={this.disableBackground}><button className="submit__exit" aria-label="cancel" onClick={this.cancel}>X</button>{display}</div>
    }
}

export default Submit;

