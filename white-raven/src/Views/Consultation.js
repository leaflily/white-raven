import React from 'react';
import Header from './Header';
import Nav from './Nav';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import BookingModal from './BookingModal';
import CodeOfEthicsModal from './CodeOfEthicsModal';
import QnAModal from './QnAModal';
import './main.css';
import './Consultation.css';
import Image from './Image';

class Consultation extends React.Component {
    constructor(props) {
        super(props);
        this.quote = {
            text: <q>Until one has loved an animal a part of one’s soul remains unawakened</q>,
            author: 'Irene M. Pepperberg'
        };
        this.stages = ['one', 'two', 'three', 'four', 'five'];
        this.state = {
            stageForwards: true,
            modalSelected: 'none',
            paymentStage: false,
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
            notFilledIn: '',
            error: null
        };
        this.script = document.createElement("script");
        this.handleEvent = this.handleEvent.bind(this);
        this.closeOnEsc = this.closeOnEsc.bind(this);
        this.eventFunctions.closeModal = this.eventFunctions.closeModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.debounceActive = false;
    }
    componentWillMount() {
        this.script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=GBP";
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
    modals = {
        booking: () => <BookingModal 
            stageForwards={this.state.stageForwards} 
            notFilledIn={this.state.notFilledIn} 
            photo={this.state.inputs.photo} 
            handleEvent={this.handleEvent} 
            handleInput={this.handleInput} 
            stage={this.paymentStage ? this.stages[this.stages.length - 1] : this.stages[this.state.bookingStage]} 
            inputs={this.state.inputs} />,
        codeOfEthics: () => <CodeOfEthicsModal handleEvent={this.handleEvent} />,
        qna: () => <QnAModal handleEvent={this.handleEvent} />,
        none: () => <></>
    };  
    requiredInputs = {
        0: [],
        1: ['photo', 'name', 'age', 'gender'],
        2: ['reason'],
        3: ['clientName', 'clientEmail', 'clientNumber'],
        4: []
    }
    eventFunctions = {
        input: (name, value) => {
            this.setState({
                [name]: value
            });
        },
        openModal(name) {
            this.setState({
                modalSelected: name
            });
            window.addEventListener('keydown', this.closeOnEsc);
        },
        closeModal() {
            this.setState({
                modalSelected: 'none'
            });
            window.removeEventListener('keydown', this.closeOnEsc);
        },
        nextStage() {
            var notFilledIn = this.requiredInputs[this.state.bookingStage].find(input => !this.state.inputs[input] || (input === 'gender' && this.state.inputs.gender === 'gender'));
            const goToNextStage = () => {
                const stage = this.state.bookingStage + 1;
                this.debounce(500);
                this.setState({
                    stageForwards: true,
                }, () =>  this.setState({
                    bookingStage: stage
                } ));
            }
            const goToPaymentStage = () => {
                console.log('pay stage');
                this.debounce(500);
                this.setState({
                    stageForwards: true,
                }, () =>  this.setState({
                    paymentStage: true,
                    bookingStage: this.stages.length - 1
                } ));
            }
            if (notFilledIn) {
                console.log(notFilledIn);
                this.setState({ notFilledIn });
            }
            else {
                if (!this.debounceActive) {
                    if (this.state.bookingStage === this.stages.length - 1) { 
                        goToPaymentStage()
                        // this.sendBookingInfo().then(() => goToPaymentStage()).catch(err => this.handleError(err));
                    }
                    else if (this.state.bookingStage < this.stages.length - 1) {
                        goToNextStage();
                    }
                }
            }
        },
        prevStage() {
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
                    this.eventFunctions.closeModal();
                }
            }
        },
        submit(name) {
            if (name === 'book') {
                const data = JSON.stringify(this.state.inputs);
                const xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/server/emailclientinfo.php", true);
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        this.confirmBooking();
                    }
                };
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(data);
            }
        },
        cancelBooking() {
            this.resetBookingInputs();
            this.eventFunctions.closeModal();
        }
    };
    sendBookingInfo() {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(this.state.inputs);
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/server/emailclientinfo.php", true);
            xhttp.onreadystatechange = function(err) {
                if (this.readyState === 4 && this.status === 200) {
                    resolve();
                }
                else {
                    reject(err);
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(data);
        });
    }
    confirmBooking() {
        this.setState({
            bookingStage: 'success'
        }, this.resetBookingInputs)
    }
    closeOnEsc(e) {
        if (e.key === 'Escape') {
            this.eventFunctions.closeModal();
        }
    }
    handleEvent(e) {
        if (!e.target.hasAttribute("type") || e.target.getAttribute("type") !== 'file') {
            // do not preventDefault for fileuploads 
            e.preventDefault();
        }
        const target = e.target.hasAttribute("data-func") ? e.target : e.target.parentElement;
        const func = target.getAttribute("data-func");
        let params = target.hasAttribute("data-params") ? target.getAttribute("data-params").replace(/\s\s+/g, "").split(",") : [];
        if (params.includes("value")) { 
            params.splice(params.indexOf("value"), 1, target.value);
        }
        func && this.eventFunctions[func].apply(this, params);
    }
    input(name, value) {
        const newInputValues = Object.assign({}, this.state.inputs);
        newInputValues[name] = value;
        this.setState({
            inputs: newInputValues,
            notFilledIn: ''
        })
        sessionStorage.setItem(name, value);
    }
    handleInput(e) {
        e.preventDefault();
        const target = e.target.hasAttribute("data-name") ? e.target : e.target.parentElement;
        const name = target.getAttribute("data-name");
        if (target.hasAttribute("type")) {
            if (target.getAttribute("type") === 'file' && target.files.length > 0) {
                this.input(name, URL.createObjectURL(target.files[0]));
            }
            else {
                this.input(name, target.value);
            }
        }
        else {
            if (target.tagName === 'SELECT') {
                this.input(name, target.value);
            }
            else {
                this.input(name, target.value);
            }
        }
    }
    handleError(msg) {

    }
    resetBookingInputs() {
        this.setState({
            paymentStage: false,
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
        return (
            <>
                <Header page="consultation" quote={this.quote} />
                <div className={this.state.modalSelected !== 'none' ? 'modal-back' : undefined}>
                    <TransitionGroup>
                        <CSSTransition
                            key={this.state.modalSelected}
                            timeout={300}
                            classNames='modal-fade modal-fade'
                        >
                        { this.modals[this.state.modalSelected]() }
                        </CSSTransition>
                    </TransitionGroup>
                </div>
                <main className="main main--consultation">
                    
                       
                <div className="main__section-background main__section-background--blue">
                <section className="main__section main__section--info">       
                                <button onClick={this.handleEvent} data-func="openModal" data-params="qna" className="main__section__button main__section__button--qna">Q & A</button>
                                <button onClick={this.handleEvent} data-func="openModal" data-params="codeOfEthics" className="main__section__button main__section__button--code-of-ethics">Code of Ethics</button>
                        </section>
                    <section className="main__section">
                        <button onClick={this.handleEvent} data-func="openModal" data-params="booking" className="main__section__button main__section__button--book">
                            Book a Session 
                        </button>
                    </section>
                </div>
                <div className="main__section-background main__section-background--orange">
                    <div className="main__section-background__img main__section-background__img--Elephant image">
                        <Image fileName="elephants.jpg" sizeShifts={[0, 420, 820, 1404]} className="" alt="Elephants embracing, trunk coiled around trunk" />
                    </div>
                </div>
                </main>
                <Nav page="consultation" />
            </>
        )
    }
}

export default Consultation;