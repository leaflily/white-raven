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
        this.start = React.createRef('#');
        this.lastStage = 0;
    }
    componentWillMount() {
        this.script.src = "https://www.paypal.com/sdk/js?client-id=AYDMCiH0BgRjIGDfXnb8a1biWbvoJmKbc9UwgFaDz0bJ-kNQZjWHXYFqFGDzk9_ZMtzRClA20BHQrWyA&currency=GBP";
        this.script.async = true;
        document.body.appendChild(this.script);
        if (sessionStorage.getItem('bookingInputs') !== null) {
            const localData = JSON.parse(sessionStorage.getItem('bookingInputs'));
            const stage = parseInt(sessionStorage.getItem('bookingStage')) || 0;
            setTimeout( () =>
                this.setState({
                    inputs: localData,
                    bookingStage: stage
                },
                () => {
                    if (sessionStorage.getItem('stage') === 'payed') {
                        this.sendConfirmation();
                    }
                    else if (sessionStorage.getItem('stage') === 'confirmed') {
                        this.confirmBooking();
                    }
                    else if (sessionStorage.getItem('stage') === 'finished') {
                        this.resetBookingInputs();
                    }
                }),
            0);
        }
    }
    componentWillUnmount() {
        document.body.removeChild(this.script);
        const data = this.state.inputs;
        delete data.photo;
        sessionStorage.setItem('bookingInputs', JSON.stringify(data));
        const bookingStage = this.stages[this.state.bookingStage];
        const stage = bookingStage === 'Confirmation' ? this.stages.indexOf('Confirmation') : bookingStage === 'Payment' ? this.stages.indexOf('Payment') : bookingStage === 'Start' ? 0 : 1;
        sessionStorage.setItem('bookingStage', stage.toString());
    }
    componentDidMount() {
        document.title = 'Booking - White Raven';
        this.start.current.focus();
    }
    componentDidUpdate() {
        if (this.lastStage !== this.state.bookingStage) {
            this.lastStage = this.state.bookingStage;
            this.start.current.hasOwnProperty('focus') && this.start.current.focus();
        }
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
                });
                sessionStorage.setItem(name, value);
            },
            handle: e => {
                if (!e.target.hasAttribute("type") || e.target.getAttribute("type") !== 'file') {
                    // do not preventDefault for fileuploads 
                    e.preventDefault();
                }
                const target = e.target.hasAttribute("data-name") ? e.target : e.target.parentElement;
                const name = target.getAttribute("data-name");
                if (target.hasAttribute("type") && target.getAttribute("type") === 'file' && target.files.length > 0) {
                    this.photoFile = target.files[0];
                    this.photoName = Date.now()+''+this.photoFile.name;
                    this.events.input.data(name, URL.createObjectURL(target.files[0]));
                }
                else {
                    this.events.input.data(name, target.value);
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
            }));
        },
        nextStage: () => {
            var invalid = this.requiredInputs[this.state.bookingStage].find(input => !this.state.inputs[input] || (input === 'gender' && this.state.inputs.gender === 'gender'));
            if (invalid) {
                this.setState({ 
                    invalid: ''
                }, () => {
                    this.setState({ 
                        invalid
                    });
                });
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
                    }));
                }
                else {
                    this.events.closeModal();
                }
            }
        },
        closeModal: () => {
            if (this.stages[this.state.bookingStage] === 'Payment') {

            }
            else {
                if (this.stages[this.state.bookingStage] === 'Confirmation') {
                    this.resetBookingInputs();
                    sessionStorage.setItem('stage', 'finished');
                }
                this.props.closeModal();
            }
        },
        cancelBooking: () => {
            this.sendCancelBooking();
        },
        onPayment: () => {
            sessionStorage.setItem('stage', 'payed');
            this.sendConfirmation();
        }
    };
    sendBookingInfo() {
        this.submit.url = '/server/emailbookinginfo.php';
        this.submit.statusMessages = {
            onTry: 'Sending booking info'
        }
        this.submit.success = () => {
            this.submit.closeStatus();
            this.events.goToPaymentStage();
        }
        this.submit.data = Object.assign({}, this.state.inputs, {photoFile: this.photoFile, photoName: this.photoName});
        this.submit.try();
    }
    sendCancelBooking() {
        this.submit.url = '/server/cancelbooking.php';
        this.submit.statusMessages = {
            onTry: 'Canceling booking'
        }
        this.submit.success = () => {
            this.resetBookingInputs();
            this.submit.closeStatus();
            this.events.closeModal();
        }
        this.submit.latch = true;
        this.submit.captcha = false;
        this.submit.data = this.state.inputs;
        this.submit.try();
    }
    sendConfirmation() {
        this.submit.url = '/server/emailbookingconfirmation.php';
        this.submit.statusMessages = {
            onTry: 'Finishing Up'
        }
        this.submit.success = () => {
            sessionStorage.setItem('stage', 'confirmed');
            this.submit.closeStatus();
            this.confirmBooking();
        }
        this.submit.latch = true;
        this.submit.captcha = false;
        this.submit.data = Object.assign({}, this.state.inputs, {photoName: this.photoName});
        this.submit.try();
    }
    confirmBooking() {
        this.setState({
            bookingStage: this.stages.indexOf('Confirmation')
        });
    }
    submit = {
        getProps: () => {
            return {
                data: this.submit.data,
                url: this.submit.url,
                onSuccess: this.submit.success,
                cancel: this.submit.cancel,
                statusMessages: this.submit.statusMessages,
                captcha: this.submit.captcha,
                latch: this.submit.latch
            }
        },
        url: '',
        latch: false,
        captcha: true,
        statusMessages: {},
        try: () => {
            this.submit.removeExcessData();
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
        },
        removeExcessData: () => {
            delete this.submit.data.photo;
        }
    }
    resetBookingInputs() {
        sessionStorage.removeItem('bookingInputs');
        sessionStorage.removeItem('bookingStage');
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
        });
        sessionStorage.setItem('stage', 'new');
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
            <div tabIndex="-1" ref={this.start} className="modal modal--Booking" onClick={this.events.handle} data-dest="BookingModal" data-func="closeModal">
                {this.state.showStatus && <Submit {...this.submit.getProps()} /> }
                <div className="modal__box">
                    {this.stages[this.state.bookingStage] !== 'Payment' &&
                    <button aria-label="close modal" className="modal__box__exit" onClick={this.events.handle} data-dest="BookingModal" data-func="closeModal">X</button> }
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
                                    <button onClick={this.events.handle} aria-label="previous." data-dest="BookingModal" data-func="prevStage">Previous</button>)
                                }
                                
                                { (this.stages[this.state.bookingStage] !== 'Payment' && this.stages[this.state.bookingStage] !== 'Confirmation') && 
                                    <button onClick={this.events.handle} aria-label="next." data-dest="BookingModal" data-func="nextStage">Next</button>
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