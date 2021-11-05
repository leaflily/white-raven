import React from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import BookingModal from '../Modals/BookingModal';
import CodeOfEthicsModal from '../Modals/CodeOfEthicsModal';
import QuestionsModal from '../Modals/QuestionsModal';
import './main.css';
import './Consultation.css';
import Image from '../Components/Image';

class Consultation extends React.Component {
    constructor(props) {
        super(props);
        this.quote = {
            text: <q>Until one has loved an animal a part of one’s soul remains unawakened</q>,
            author: 'Irene M. Pepperberg'
        };
        this.state = {
            modalSelected: 'none'
        };
        this.handleEvent = this.handleEvent.bind(this);
        this.closeOnEsc = this.closeOnEsc.bind(this);
        this.eventFunctions.closeModal = this.eventFunctions.closeModal.bind(this);
        this.debounceActive = false;
        this.start = React.createRef(null);
    }
    componentDidMount() {
        document.title = 'Consultation - White Raven';
        this.start.current.focus();
    }   
    modals = {
        booking: () => <BookingModal handleEvent={this.handleEvent} closeModal={this.eventFunctions.closeModal} />,
        codeOfEthics: () => <CodeOfEthicsModal handleEvent={this.handleEvent} />,
        questions: () => <QuestionsModal handleEvent={this.handleEvent} />,
        none: () => <></>
    };  
    eventFunctions = {
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
            document.title = 'Consultation - White Raven';
            this.start.current.focus();
        }
    };
    closeOnEsc(e) {
        if (e.key === 'Escape') {
            this.eventFunctions.closeModal();
        }
    }
    handleEvent(e) {
        const target = e.target.hasAttribute('data-dest') ? e.target : e.target.parentElement;
        if (target.getAttribute('data-dest') === 'Consultation') {
            if (!target.hasAttribute('type') || target.getAttribute('type') !== 'file') {
                // do not preventDefault for fileuploads 
                e.preventDefault();
            }
            const func = target.getAttribute('data-func');
            let params = target.hasAttribute('data-params') ? target.getAttribute('data-params').replace(/\s\s+/g, '').split(',') : [];
            if (params.includes('value')) { 
                params.splice(params.indexOf('value'), 1, target.value);
            }
            func && this.eventFunctions[func].apply(this, params);
        }
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
        const target = e.target.hasAttribute('data-name') ? e.target : e.target.parentElement;
        const name = target.getAttribute('data-name');
        if (target.hasAttribute('type')) {
            if (target.getAttribute('type') === 'file' && target.files.length > 0) {
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
    debounce(ms) {
        this.debounceActive = true;
        setTimeout(() => this.debounceActive = false, ms);
    }
    render() {
        return (
            <div tabIndex="-1" ref={this.start}>
                <Header page="consultation" quote={this.quote} tabIndex={this.state.modalSelected !== 'none' ? '-1' : ''} />
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
                <main role="main" className="main main--consultation">    
                    <div className="main__section-background main__section-background--blue">
                        <div className="main__section main__section--info">       
                            <button tabIndex={this.state.modalSelected !== 'none' ? '-1' : ''} aria-label="questions?." onClick={this.handleEvent} data-dest="Consultation" data-func="openModal" data-params="questions" className="main__section__button main__section__button--questions">Questions?<span className="hiddenPunctuation">.</span></button>
                            <button tabIndex={this.state.modalSelected !== 'none' ? '-1' : ''} aria-label="Code of Ethics." onClick={this.handleEvent} data-dest="Consultation" data-func="openModal" data-params="codeOfEthics" className="main__section__button main__section__button--code-of-ethics">Code of Ethics</button>
                        </div>
                        <div className="main__section">
                            <button tabIndex={this.state.modalSelected !== 'none' ? '-1' : ''} aria-label="Book a Session." onClick={this.handleEvent} data-dest="Consultation" data-func="openModal" data-params="booking" className="main__section__button main__section__button--book">
                                Book a Session
                            </button>
                        </div>
                    </div>
                    <div className="main__section-background main__section-background--orange">
                        <div className="main__section-background__img main__section-background__img--Elephant image">
                            <Image fileName="elephants.jpg" sizeShifts={[0, 340, 550, 1080]} className="" alt="Elephants embracing, trunk coiled around trunk" />
                        </div>
                    </div>
                </main>
                <Nav page="consultation" tabIndex={this.state.modalSelected !== 'none' ? '-1' : ''} />
            </div>
        )
    }
}

export default Consultation;