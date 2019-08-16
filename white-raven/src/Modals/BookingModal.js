import React from 'react';
import BookingStage from './BookingStage';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Submit from '../Controllers/Submit';
import validateEmail from '../utils/validateEmail';
import './BookingModal.css';

class BookingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stageForwards: true,
            bookingStage: 0,
            inputs: {
                photo: null,
                name: '',
                age: '',
                ageValue: 'years',
                gender: 'gender',
                reason: '',
                otherQuestions: '',
                clientName: '',
                clientEmail: '',
                clientNumber: '',
            },
            invalid: ''
        };
        this.stages = ['Start', 'Animal Info', 'Focus', 'Your Info', 'Payment', 'Confirmation'];
        this.script = document.createElement("script");
        this.events.handle = this.events.handle.bind(this);
        this.events.input.handle = this.events.input.handle.bind(this);
        this.debounceActive = false;
    }
    componentWillMount() {
        this.script.src = "https://www.paypal.com/sdk/js?client-id=Ab1pvgInjBlt_U7KDzpR54yqJDDV6Qk1X6riflHic00-oMSS8WSpXR_W7wP6xs76-zLIP6wp5Lojpkme&currency=GBP";
        this.script.async = true;
        document.body.appendChild(this.script);
        if (sessionStorage.getItem('bookingInputs') !== null) {
            const localData = JSON.parse(sessionStorage.getItem('bookingInputs'));
            setTimeout( () =>
                this.setState({
                    inputs: localData
                }),
            0);
        }
    }
    componentWillUnmount() {
        document.body.removeChild(this.script);
        const data = this.state.inputs;
        data.photo = null;
        sessionStorage.setItem('bookingInputs', JSON.stringify(data));
    }
    requiredInputs = {
        0: [],
        1: ['photo', 'name', 'age', 'gender'],
        2: ['reason'],
        3: ['clientName', 'clientEmail', 'clientNumber'],
        4: [],
        5: []
    }
    events = {
        handle: e => {
            const target = e.target.hasAttribute('data-dest') ? e.target : e.target.parentElement;
            if (target.getAttribute('data-dest') === 'BookingModal') {
                if (!e.target.hasAttribute("type") || e.target.getAttribute("type") !== 'file') {
                    // do not preventDefault for fileuploads 
                    e.preventDefault();
                }
                const func = target.getAttribute("data-func");
                let params = target.hasAttribute("data-params") ? target.getAttribute("data-params").replace(/\s\s+/g, "").split(",") : [];
                if (params.includes("value")) { 
                    params.splice(params.indexOf("value"), 1, target.value);
                }
                func && this.events[func].apply(this, params);
            }
        },
        input: {
            data: (name, value) => {
                const newInputValues = Object.assign({}, this.state.inputs);
                newInputValues[name] = value;
                this.setState({
                    inputs: newInputValues,
                    invalid: ''
                })
                sessionStorage.setItem(name, value);
            },
            handle: e => {
                if (!e.target.hasAttribute("type") || e.target.getAttribute("type") !== 'file') {
                    // do not preventDefault for fileuploads 
                    e.preventDefault();
                }
                const target = e.target.hasAttribute("data-name") ? e.target : e.target.parentElement;
                const name = target.getAttribute("data-name");
                if (target.hasAttribute("type")) {
                    if (target.getAttribute("type") === 'file' && target.files.length > 0) {
                        this.events.input.data(name, URL.createObjectURL(target.files[0]));
                    }
                    else {
                        this.events.input.data(name, target.value);
                    }
                }
                else {
                    if (target.tagName === 'SELECT') {
                        this.events.input.data(name, target.value);
                    }
                    else {
                        this.events.input.data(name, target.value);
                    }
                }
            }
        },
        goToPaymentStage: () => {
            this.debounce(500);
            this.setState({
                stageForwards: true,
            }, () =>  this.setState({
                bookingStage: this.stages.indexOf('Payment')
            } ));
        },
        goToNextStage: () => {
            const stage = this.state.bookingStage + 1;
            this.debounce(500);
            this.setState({
                stageForwards: true,
            }, () =>  this.setState({
                bookingStage: stage
            } ));
        },
        nextStage: () => {
            var invalid = this.requiredInputs[this.state.bookingStage].find(input => !this.state.inputs[input] || (input === 'gender' && this.state.inputs.gender === 'gender'));
            if (invalid) {
                this.setState({ invalid });
            }
            else {
                if (!this.debounceActive) {
                    if (this.stages[this.state.bookingStage+1] === 'Payment') { 
                        if (!validateEmail(this.state.inputs.clientEmail)) {
                            this.setState({ invalid: 'clientEmail' });
                        }
                        else {
                            this.sendBookingInfo();
                        }
                    }
                    else if (this.state.bookingStage < this.stages.length - 1) {
                        this.events.goToNextStage();
                    }
                }
            }
        },
        prevStage: () => {
            if (!this.debounceActive) {
                if (this.state.bookingStage > 0) {
                    this.debounce(500);
                    const stage = this.state.bookingStage - 1;
                    this.setState({
                        stageForwards: false,
                    }, () =>  this.setState({
                        bookingStage: stage
                    } ));
                }
                else {
                    this.events.closeModal();
                }
            }
        },
        closeModal: () => {
            this.props.closeModal();
        },
        cancelBooking: () => {
            this.events.closeModal();
            this.resetBookingInputs();
        },
        onPayment: () => {
            this.sendConfirmation();
        }
    };
    sendBookingInfo() {
        this.submit.url = '/server/emailclientinfo.php';
        this.submit.statusMessages = {
            onTry: 'Sending booking info',
            onUnableToConnect: 'Unable to send booking info. Please check your internet connection and try again.',
        }
        this.submit.success = () => {
            this.submit.closeStatus();
            this.events.goToPaymentStage();
        }
        this.submit.try();
    }
    sendConfirmation() {
        this.submit.url = '/server/emailbookingconfirmation.php';
        this.submit.statusMessages = {
            onTry: 'Finishing Up',
            onUnableToConnect: 'Unable to send confirmation email. Please check your internet connection and try again.',
        }
        this.submit.success = () => {
            this.submit.closeStatus();
            this.confirmBooking();
        }
        this.submit.latch = true;
        this.submit.captcha = false;
        this.submit.try();
    }
    confirmBooking() {
        this.setState({
            bookingStage: 'success'
        }, this.resetBookingInputs);
    }
    submit = {
        test: console.log(this.props),
        getProps: () => {
            return {
                data: this.submit.data(),
                url: this.submit.url,
                onSuccess: this.submit.success,
                cancel: this.submit.cancel,
                statusMessages: this.submit.statusMessages,
                captcha: this.submit.captcha,
                latch: this.submit.resetLatch
            }
        },
        url: '',
        latch: false,
        captcha: true,
        statusMessages: {},
        data: () => this.state.inputs,
        try: () => {
            this.setState({
                showStatus: true
            });
        },
        success: () => {
            this.submit.closeStatus();
        },
        cancel: () => {
            this.submit.closeStatus();
        },
        closeStatus: () => {
            this.setState({
                showStatus: false
            })
        }
    }
    resetBookingInputs() {
        this.setState({
            bookingStage: 0,
            inputs: {
                photo: null,
                name: '',
                age: '',
                ageValue: 'years',
                gender: 'gender',
                reason: '',
                otherQuestions: '',
                clientName: '',
                clientEmail: '',
                clientNumber: '',
            }
        })
        sessionStorage.removeItem('bookingInputs');
    }
    debounce(ms) {
        this.debounceActive = true;
        setTimeout(() => this.debounceActive = false, ms);
    }
    render() {
        const bookingStageProps = {
            invalid: this.state.invalid, 
            photo: this.stages[this.state.bookingStage] === 'Animal Info' ? this.state.inputs.photo : null,
            stage: this.stages[this.state.bookingStage],
            handleEvent: this.events.handle,
            handleInput: this.events.input.handle,
            inputs: this.state.inputs,
            payed: this.events.onPayment,
            close: this.props.closeModal
        }
        return (
            <div className="modal modal--Booking" onClick={this.props.handleEvent} data-dest="Consultation" data-func="closeModal">
                {this.state.showStatus && <Submit {...this.submit.getProps()} /> }
                <div className="modal__box">
                    <button aria-label="close Book a Session modal" className="modal__box__exit" onClick={this.props.handleEvent} data-dest="Consultation" data-func="closeModal">X</button>   
                    <div className="modal__box__content">
                        <div className={'modal__booking-stage modal__booking-stage--'+this.stages[this.state.bookingStage]}>
                            <h2 className="modal__booking-stage__title">Booking - {this.stages[this.state.bookingStage]}</h2>
                            { this.state.stageForwards ?
                                <TransitionGroup>
                                    <CSSTransition
                                        key={this.stages[this.state.bookingStage]}
                                        timeout={1300}
                                        classNames='booking-fade booking-fade-forwards'
                                    >
                                        <div>
                                            <BookingStage {...bookingStageProps} />
                                        </div>
                                    </CSSTransition>
                                </TransitionGroup> :
                                <TransitionGroup>
                                    <CSSTransition
                                        key={this.stages[this.state.bookingStage]}
                                        timeout={1300}
                                        classNames='booking-fade booking-fade-backwards'
                                    >
                                        <div>
                                            <BookingStage {...bookingStageProps} />
                                        </div>
                                    </CSSTransition>
                                </TransitionGroup>
                            }
                            <nav className="modal__booking-stage__nav">
                                { (this.stages[this.state.bookingStage] !== 'Payment' && this.stages[this.state.bookingStage] !== 'Confirmation') && 
                                    (this.state.bookingStage === 0 ? 
                                    <button onClick={this.events.handle} data-dest="BookingModal" data-func="prevStage" disabled>Previous</button> :
                                    <button onClick={this.events.handle} data-dest="BookingModal" data-func="prevStage">Previous</button>)
                                }
                                
                                { (this.stages[this.state.bookingStage] !== 'Payment' && this.stages[this.state.bookingStage] !== 'Confirmation') && 
                                    <button onClick={this.events.handle} data-dest="BookingModal" data-func="nextStage">Next</button>
                                }
                            </nav>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }
}

export default BookingModal;