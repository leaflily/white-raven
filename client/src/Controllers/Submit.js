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
            showCaptcha: false, 
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
        this.handleCaptchaSuccess = this.handleCaptchaSuccess.bind(this);
        this.displaySendDirect = this.displaySendDirect.bind(this);
        this.disableBackground = this.disableBackground.bind(this);
        this.cancel = this.cancel.bind(this);
        this.count = 0;
        this.serverErrors = [];
        this.clientErrors = [];
        this.uploadingPhoto = !!this.data['photo'];
        this.clientOffline = false;
        console.log(this.data['photo'])
    }
    componentDidMount() {
        if (!this.props.captcha) {
            this.trySending();
        }
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

    handleCaptchaSuccess = () => {
        this.trySending()
    }
    handleCaptchaFail = () => {
        this.setState({ 
            showCaptcha: true
        });
    }

    trySending = () => {
        const newData = Object.assign({}, this.data, {timeStamp: Date.now()});
        this.data = newData;
        this.uploadingPhoto ? this.sendPhoto(this) : this.sendData(this);
    }
    sendPhoto = (thisSelf) => {
        var form_data = new FormData();
        const file = thisSelf.data.photo;
        console.log(file)
        thisSelf.updateStatus('Uploading your photo', true);
        thisSelf.xhttp = new XMLHttpRequest();
        thisSelf.xhttp.open("POST", '/server/photoUpload.php', true);
        thisSelf.xhttp.onreadystatechange = function() {

            ///// TODO this.status doesn't seem to be the res! 
            if (this.readyState === 4 && this.status === 200) {
                console.log(this) // get filename to add to form data
                thisSelf.props.onSuccess(this.response); 
            }
            else if (this.status === 403) {
                thisSelf.handleCaptchaFail();
            }
            else {
                console.log(this)
                thisSelf.xhttp && thisSelf.xhttp.abort(); 
                if (this.status == 0) { 
                    // client offline
                    thisSelf.updateStatus('Not online, please try again', false, { name: 'Retry', handler: thisSelf.trySending})
                }
                else {   
                    console.log(this) // TODO check for message to add to status
                    thisSelf.updateStatus('Unable to upload photo', false)
                }
            }
        }
        if (file) {
            form_data.append('photoFile', file);
        } 
        else {
            delete thisSelf.data.photoName;
        }
        thisSelf.xhttp.send(form_data); 
    }

    sendData = (thisSelf) => {
        this.updateStatus('Sending info', true);
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", this.props.url, true);
        this.xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) { 
                thisSelf.success();
            }
            else if (this.status === 403) {
                thisSelf.handleCaptchaFail();
            }
            else if (this.readyState === 4) {
                this.xhttp && this.xhttp.abort();
                if (this.status == 0) {
                    // client offline
                    thisSelf.updateStatus('Not online, please try again', false, { name: 'Retry', handler: thisSelf.trySending})
                }
                else {
                    thisSelf.resultLog.push('Unable to send your info. Sorry about this somethings not working right now. ');
                    thisSelf.displaySendDirect();
                }
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
        let display = <></> 
        if (this.state.showSendDirect) {
            display = <SendDirect data={JSON.stringify(this.data)} log={this.resultLog} />
        }
        else if (this.state.showCaptcha) {
            display = <Captcha {...this.getCaptchaProps()} />
        }
        else {
            display = <Status {...this.state.statusProps} />
        }
        return <div onClick={this.disableBackground}><button className="submit__exit" aria-label="cancel" onClick={this.cancel}>X</button>{display}</div>
    }
}

export default Submit;

