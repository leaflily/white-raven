import React from 'react';
import Header from './Header';
import Nav from './Nav';
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
            text: <q>Until one has loved an animal a part of one’s  soul remains unawakened</q>,
            author: 'Irene M. Pepperberg'
        };
        this.stages = ['one', 'two', 'three', 'four'];
        this.state = {
            modalVisible: false,
            modalSelected: 'booking',
            bookingStage: 0,
            inputs: {
                photo: null,
                name: '',
                age: '',
                ageValue: 'years',
                gender: 'gender',
                home: '',
                familyMembers: '',
                backgroundInfo: '',
                reason: '',
                otherQuestions: ''
            }
        };
        this.handleEvent = this.handleEvent.bind(this);
        this.closeOnEsc = this.closeOnEsc.bind(this);
        this.eventFunctions.closeModal = this.eventFunctions.closeModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    modals = {
        booking: () => <BookingModal photo={this.state.inputs.photo} handleEvent={this.handleEvent} handleInput={this.handleInput} stage={this.stages[this.state.bookingStage]} inputs={this.state.inputs} />,
        codeOfEthics: () => <CodeOfEthicsModal handleEvent={this.handleEvent} />,
        qna: () => <QnAModal handleEvent={this.handleEvent} />
    };  
    eventFunctions = {
        input: (name, value) => {
            this.setState({
                [name]: value
            });
        },
        openModal(name) {
            this.setState({
                modalSelected: name,
                modalVisible: true
            });
            window.addEventListener('keydown', this.closeOnEsc);
        },
        closeModal() {
            this.setState({
                modalVisible: false
            });
            window.removeEventListener('keydown', this.closeOnEsc);
        },
        nextStage() {
            if (this.state.bookingStage < this.stages.length - 1) {
                const stage = this.state.bookingStage + 1;
                this.setState({
                    bookingStage: stage
                })
            }
        },
        prevStage() {
            if (this.state.bookingStage > 0) {
                const stage = this.state.bookingStage - 1;
                this.setState({
                    bookingStage: stage
                })
            }
            else {
                this.eventFunctions.closeModal();
            }
        }
    };
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
        console.log(target)
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
            inputs: newInputValues
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
    render() {
        return (
            <>
                <Header page="consultation" quote={this.quote} />
                <main className="main main--consultation">
                    { this.state.modalVisible && this.modals[this.state.modalSelected]() }
                <div className="main__section-background main__section-background--blue">
                    <div className="main__section-background__img main__section-background__img--Elephant image">
                        <Image fileName="elephants.jpg" sizeShifts={[0, 420, 820, 1404]} className="" alt="Elephants embracing, trunk coiled around trunk" />
                    </div>
                    <section className="main__section">
                        <button onClick={this.handleEvent} data-func="openModal" data-params="booking" className="main__section__button main__section__button--book">
                            Book a Session 
                        </button>
                    </section>
                </div>
                <div className="main__section-background main__section-background--orange">
                        <section className="main__section main__section--info">       
                                <button onClick={this.handleEvent} data-func="openModal" data-params="qna" className="main__section__button main__section__button--qna">Q & A</button>
                                <button onClick={this.handleEvent} data-func="openModal" data-params="codeOfEthics" className="main__section__button main__section__button--code-of-ethics">Code of Ethics</button>
                        </section>
                </div>
                </main>
                <Nav page="consultation" />
            </>
        )
    }
}

export default Consultation;