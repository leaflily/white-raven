import React from 'react';
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
            messageSent: false,
            showStatus: false,
            invalid: ''
        }
        this.handleEvent = this.handleEvent.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
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
        finish() {
            this.setState({
                message: '',
                name: '',
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


    closeStatus() {
        this.setState({
            showStatus: false
        })
    }
    render() {
        return (
            <>
                <form onSubmit={this.preventDefault} className="modal__message__form" autoComplete="on">
                    <Textarea invalid={this.state.invalid} dataName="text" id="askmessage" value={this.state.message} onChange={this.handleEvent} data-dest="MessageModal" data-func="input" data-params="message,value" className="modal__message__text" type="text" placeholder="Your message" aria-label="Your message." />
                    <Input invalid={this.state.invalid} dataName="name" aria-label="Your name" value={this.state.name} onChange={this.handleEvent} data-dest="MessageModal" data-func="input" data-params="name,value" className="modal__message__name" type="text" placeholder="Your name" name="name" />
                    <a className="modal__message__send" href={`mailto:white3raven@gmail.com?subject=${encodeURIComponent(`White Raven Message${this.state.name ? ' - from ' + this.state.name : ''}`)}&body=${encodeURIComponent(this.state.message)}`} title="Opens your email application">
                        Email your message
                    </a>
                </form>
            </>
        )
    }
}

export default MessageModal;

