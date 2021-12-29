import React from 'react';
import Status from '../Modals/Status';
import Captcha from '../Components/Captcha';
import SendDirect from '../Components/SendDirect';
import axios from 'axios';
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
        console.log(this.props)
        //if (!this.props.captcha) {
            this.trySending();
       // }
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
        const url = '/server/photoUpload'
        const file = thisSelf.data.photo;
        const formData = new FormData();
        if (!file) {
            delete thisSelf.data.photoName;
            return false
        } 
        formData.append('photoFile', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        thisSelf.updateStatus('Uploading your photo', true);
        axios.post(url, formData, config).then((res) => {
            console.log(res)
            if (res.status === 200) {
                // get filename to add to form data
                thisSelf.props.onSuccess(res); 
            }
            else if (res.status === 403) {
                thisSelf.handleCaptchaFail();
            }
            else {
                if (res.status == 0) { 
                    // client offline
                    thisSelf.updateStatus('Not online, please try again', false, { name: 'Retry', handler: thisSelf.trySending})
                }
                else {   
                    // TODO check for message to add to status
                    thisSelf.updateStatus('Unable to upload photo', false)
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    sendData = (thisSelf) => {
        this.updateStatus('Sending info', true);
        console.log(this.data)
        axios.post(this.props.url, this.data).then(() => {
            thisSelf.success();
        }).catch((e) => {
            console.log(e)
            // if catcha fail
            // thisSelf.handleCaptchaFail();
            // if ofline 
            // thisSelf.updateStatus('Not online, please try again', false, { name: 'Retry', handler: thisSelf.trySending})
            thisSelf.resultLog.push('Unable to send your info. Sorry about this somethings not working right now. ');
            thisSelf.displaySendDirect();
        })
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

