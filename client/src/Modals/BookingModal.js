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
                quietTimes: '',
                services: '',
                photoName: ''
            },
            invalid: '',
            uploadPhotoCancelKeyCount: 0
        };
        this.stages = ['Start', 'Animal Info', 'Focus', 'Your Info', 'Sending', 'Confirmation'];
        this.script = document.createElement("script");
        this.events.handle = this.events.handle.bind(this);
        this.events.input.handle = this.events.input.handle.bind(this);
        this.debounceActive = false;
        this.start = React.createRef('#');
        this.lastStage = 0;
    }
    componentWillMount() {
        if (sessionStorage.getItem('bookingInputs') !== null) {
            const localData = JSON.parse(sessionStorage.getItem('bookingInputs'));
            const stage = parseInt(sessionStorage.getItem('bookingStage')) || 0;
            setTimeout( () =>
                this.setState({
                    inputs: localData,
                    bookingStage: stage
                },
                () => {
                    if (sessionStorage.getItem('stage') === 'emailed') {
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
     //   document.body.removeChild(this.script);
        const data = this.state.inputs;
    //    delete data.photo;
        sessionStorage.setItem('bookingInputs', JSON.stringify(data));
        const bookingStage = this.stages[this.state.bookingStage];
        const stage = bookingStage === 'Confirmation' ? this.stages.indexOf('Confirmation') : bookingStage === 'Start' ? 0 : 1;
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
        0: ['services'],
        1: ['name', 'age', 'gender'],
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
                    this.events.input.data('photo', target.files[0]);
                    setTimeout(() => this.sendPhoto(), 0)
                }
                else {
                    this.events.input.data(name, target.value);
                }
            }
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
                    if (this.stages[this.state.bookingStage+1] === 'Confirmation') { 
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
            if (this.stages[this.state.bookingStage] === 'Confirmation') {
                this.resetBookingInputs();
                sessionStorage.setItem('stage', 'finished');
            }
            this.props.closeModal();
        },
        cancelBooking: () => {
            this.sendCancelBooking();
        },
        onEmailed: () => {
            sessionStorage.setItem('stage', 'emailed');
            this.sendConfirmation();
        }
    };
    sendPhoto() {
        if (this.state.inputs.photo) {
            this.submit.url = '/server/photoUpload.php';
            this.submit.statusMessages = {
                onTry: 'Sending booking info'
            }
            this.submit.success = (photoName) => {
                this.events.input.data('photoName', photoName);
                this.events.input.data('photo', false);
                this.setState({
                    showUploadPhoto: false,
                    uploadPhotoCancelKeyCount: this.state.uploadPhotoCancelKeyCount + 1
                });
            }
            this.submit.data = this.state.inputs;
            this.setState({
                showUploadPhoto: true
            })
        }
    }
    sendBookingInfo() {
        this.submit.url = '/server/emailbookinginfo.php';
        this.submit.statusMessages = {
            onTry: 'Sending booking info'
        }
        this.submit.success = () => {
            this.submit.closeStatus();
            this.events.goToNextStage();
        }
        this.submit.data = this.state.inputs;
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
        this.submit.data = this.state.inputs;
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
                captcha: this.submit.captcha
            }
        },
        url: '',
        captcha: false,
        statusMessages: {},
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
                showStatus: false,
                showUploadPhoto: false,
                uploadPhotoCancelKeyCount: this.state.uploadPhotoCancelKeyCount + 1
            });
            this.events.input.data('photo', null);
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
            uploadedPhoto: this.state.inputs.photoName && `/server/uploads/${this.state.inputs.photoName}`,
            uploadPhotoCancelKeyCount: this.state.uploadPhotoCancelKeyCount,
            stage: this.stages[this.state.bookingStage],
            handleEvent: this.events.handle,
            handleInput: this.events.input.handle,
            inputs: this.state.inputs,
            emailed: this.events.onEmailed,
            close: this.props.closeModal,
            includesReiki: this.state.inputs.services && !!this.state.inputs.services.match(/reiki/i)
        }
    
        return (
            <div tabIndex="-1" ref={this.start} className="modal modal--Booking" onClick={this.events.handle} data-dest="BookingModal" data-func="closeModal">
                {this.state.showUploadPhoto && <Submit {...this.submit.getProps()} /> }
                {this.state.showStatus && <Submit {...this.submit.getProps()} /> }
                <div className="modal__box">
                    <button aria-label="close modal" className="modal__box__exit" onClick={this.events.handle} data-dest="BookingModal" data-func="closeModal">X</button>
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
                                { (this.stages[this.state.bookingStage] !== 'Confirmation' && this.stages[this.state.bookingStage] !== 'Sending') && 
                                    (this.state.bookingStage === 0 ? 
                                    <button onClick={this.events.handle} data-dest="BookingModal" data-func="prevStage" disabled>Previous</button> :
                                    <button onClick={this.events.handle} aria-label="previous." data-dest="BookingModal" data-func="prevStage">Previous</button>)
                                }
                                
                                { (this.stages[this.state.bookingStage] !== 'Confirmation' && this.stages[this.state.bookingStage] !== 'Sending') &&
                                 <button onClick={this.events.handle} aria-label="next." data-dest="BookingModal" data-func="nextStage">
                                    { this.stages[this.state.bookingStage+1] === 'Sending' ?
                                        'Send' :
                                        'Next'
                                    }
                                 </button>
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