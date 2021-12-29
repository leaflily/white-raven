import React from 'react';
import Submit from '../Controllers/Submit';
import validateEmail from '../utils/validateEmail';
import QnA from '../Components/QnA';
import Input from '../Components/Input';
import Textarea from '../Components/Textarea';
import './modal.css';
import './MessageModal.css';

class MessageModal extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            message: '',
            name: '',
            email: '',
            messageSent: false,
            showStatus: false,
            invalid: ''
        }
        this.handleEvent = this.handleEvent.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
        this.eventFunctions.submit = this.eventFunctions.submit.bind(this);
        this.submit.cancel = this.submit.cancel.bind(this);
    }
    componentDidMount() {
        document.title = 'Message - White Raven';
    }
    eventFunctions = {
        input(name, value) {
            this.setState({
                [name]: value,
                invalid: ''
            });
        },
        submit: () => { 
            if (!this.state.showStatus) {
                const {email} = this.state;
                if (this.state.message === '') {
                    this.setState({
                        invalid: 'text'
                    });
                }
                else if (this.state.name === '') {
                    this.setState({
                        invalid: 'name'
                    });
                }
                else if (!validateEmail(email)) {
                    this.setState({
                        invalid: 'email'
                    });
                }
                else {
                    this.submit.sendMessage();
                }
            }
        },
        finish() {
            this.setState({
                message: '',
                name: '',
                email: '',
                messageSent: false,
                showStatus: false,
                invalid: ''
            });
        }
    };
    handleEvent(e) {
        const target = e.target.hasAttribute('data-dest') ? e.target : e.target.parentElement;
        if (target.getAttribute('data-dest') === 'MessageModal') {
            e.preventDefault();
            const func = target.getAttribute('data-func');
            let params = target.hasAttribute('data-params') ? target.getAttribute("data-params").replace(/\s\s+/g, '').split(',') : [];
            if (params.includes('value')) { 
                params.splice(params.indexOf('value'), 1, target.value);
            }
            func && this.eventFunctions[func].apply(this, params);
        }
    }
    preventDefault(e) {
        e.preventDefault();
    }

    // submit stuff
    submit = {
        getProps: () => {
            return {
                data: this.submit.getData(),
                url: this.submit.url,
                onSuccess: this.submit.success,
                cancel: this.submit.cancel,
                captcha: this.submit.captcha,
                latch: this.submit.latch
            }
        },
        latch: false,
        try: () => {
            this.setState({
                showStatus: true
            });
        },
        cancel: () => {
            this.setState({
                showStatus: false
            }, () => this.closeStatus());
        },
        getData: () => {
            const {message, name, email} = this.state;
            return {message, name, email}
        }, 
        sendMessage: () => {
            this.submit.captcha = true;
            this.submit.url = '/server/message';
            this.submit.latch = false;
            this.submit.success = () => {
                this.setState({
                    messageSent: true,
                    showStatus: false
                });
            };
            this.submit.success = this.submit.success.bind(this);
            this.submit.try();
        }
    }
    closeStatus() {
        this.setState({
            showStatus: false
        })
    }
    messageCompleteMessage() {
        return (
            <div className="modal__qna__complete">
                <div className="modal__qna__complete__header">
                    <h2>message Sent!</h2>
                </div>
                <QnA q={this.state.message}
                    a={<>Thank you {this.state.name} for your message.<br /> 
                    I'll get back to you soon.<br />
                    You should receive a email confirming I've 
                    received your message<br />(P.S. if you can't find 
                    the confirmation email please double check {this.state.email} is 
                    the correct address and check your email's junk folder)</>} 
                />
            </div>
        )
    };
    render() {
        return (
            <>
                { this.state.showStatus && <Submit {...this.submit.getProps()} /> }
                { this.state.messageSent ? this.messageCompleteMessage() :
                    <form onSubmit={this.preventDefault} className="modal__message__form" autoComplete="on">
                        <Textarea invalid={this.state.invalid} dataName="text" id="askmessage" value={this.state.message} onChange={this.handleEvent} data-dest="MessageModal" data-func="input" data-params="message,value" className="modal__message__text" type="text" placeholder="Your message" aria-label="Your message." />
                        <Input invalid={this.state.invalid} dataName="name" aria-label="Your name" value={this.state.name} onChange={this.handleEvent} data-dest="MessageModal" data-func="input" data-params="name,value" className="modal__message__name" type="text" placeholder="Your name" name="name" />
                        <Input invalid={this.state.invalid} dataName="email" aria-label="Email address" value={this.state.email} onChange={this.handleEvent} data-dest="MessageModal" data-func="input" data-params="email,value" className="modal__message__email" type="email" placeholder="Email address" name="email" /> 
                        <input aria-labelledby="askmessage" onClick={this.handleEvent} data-dest="MessageModal" data-func="submit" className="modal__message__send" type="submit" value="Send" />
                    </form>
                }
            </>
        )
    }
}

export default MessageModal;

