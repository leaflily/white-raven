import React from 'react';
import BookingStage from './BookingStage';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './BookingModal.css';

class BookingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stageForwards: true,
            bookingStage: 0,
            inputs: {
                name: '',
                age: '',
                ageValue: 'years',
                gender: 'gender',
                reason: '',
                otherQuestions: '',
                clientName: '',
                clientNumber: '',
                quietTimes: '',
                services: '',
            },
            invalid: '',
            uploadPhotoCancelKeyCount: 0
        };
        this.stages = ['Start', 'Animal Info', 'Focus', 'Your Info', 'Send'];
        this.script = document.createElement("script");
        this.events.handle = this.events.handle.bind(this);
        this.events.input.handle = this.events.input.handle.bind(this);
        this.debounceActive = false;
        this.start = React.createRef('#');
        this.requiredInputs = {
            0: ['services'],
            1: ['name', 'age', 'gender'],
            2: ['reason'],
            3: ['clientName'],
            4: []
        }
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
                }),
            0);
        }
    }
    componentWillUnmount() {
        const data = this.state.inputs;
        sessionStorage.setItem('bookingInputs', JSON.stringify(data));
        sessionStorage.setItem('bookingStage', this.state.bookingStage);
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

    events = {
        handle: e => {
            const target = e.target;
            const func = target.getAttribute("data-func");
            let params = target.hasAttribute("data-params") ? target.getAttribute("data-params").replace(/\s\s+/g, "").split(",") : [];
            if (params.includes("value")) { 
                params.splice(params.indexOf("value"), 1, target.value);
            }
            func && this.events[func].apply(this, params);
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
                const target = e.target.hasAttribute("data-name") ? e.target : e.target.parentElement;
                const name = target.getAttribute("data-name");
                this.events.input.data(name, target.value);
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
                if (!this.debounceActive && (this.state.bookingStage < this.stages.length - 1)) {
                    this.events.goToNextStage();
        
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
            this.props.closeModal();
        },
        doneWithModal: () => {
            if (this.stages[this.state.bookingStage] === 'Send') {
                this.resetBookingInputs();
            }
            this.props.closeModal();
        }
    };

    resetBookingInputs() {
        sessionStorage.removeItem('bookingInputs');
        sessionStorage.removeItem('bookingStage');
        this.setState({
            bookingStage: 0,
            inputs: {
                name: '',
                age: '',
                ageValue: 'years',
                gender: 'gender',
                reason: '',
                otherQuestions: '',
                clientName: '',
                clientNumber: '',
                quietTimes: '',
                services: ''
            }
        });
    }
    debounce(ms) {
        this.debounceActive = true;
        setTimeout(() => this.debounceActive = false, ms);
    }

    render() {
        const bookingStageProps = {
            invalid: this.state.invalid, 
            stage: this.stages[this.state.bookingStage],
            handleEvent: this.events.handle,
            handleInput: this.events.input.handle,
            inputs: this.state.inputs,
            close: this.props.closeModal,
            includesReiki: this.state.inputs.services && !!this.state.inputs.services.match(/reiki/i)
        }
    
        return (
            <div tabIndex="-1" ref={this.start} className="modal modal--Booking">
                <div className="modal__box">
                    <button aria-label="close modal" className="modal__box__exit" onClick={this.events.closeModal}>X</button>
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
                                    <button onClick={this.events.prevStage} disabled>Previous</button> :
                                    <button onClick={this.events.prevStage} aria-label="previous.">Previous</button>)
                                }
                                
                                { (this.stages[this.state.bookingStage] !== 'Confirmation' && this.stages[this.state.bookingStage] !== 'Sending') &&
                                    (this.state.bookingStage === this.stages.length - 1 ? 
                                        <button onClick={this.events.doneWithModal}>Done</button> :
                                        <button onClick={this.events.nextStage}>Next</button>)
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