import React from 'react';
import BookingStage from './BookingStage';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './BookingModal.css';

function BookingModal(props) {
    const stageTitles = {
        one: 'Start',
        two: 'Animal Info', 
        three:  'Focus',    
        four: 'Your Info',   
        five: 'Payment'
    };
    return (
        <div className="modal modal--Booking" onClick={props.handleEvent} data-func="closeModal">
            <div className="modal__box">
                <div className="modal__box__exit" onClick={props.handleEvent} data-func="closeModal">X</div>   
                <div className="modal__box__content">
                    <div className={'modal__booking-stage modal__booking-stage--'+props.stage}>
                        <h2 className="modal__booking-stage__title">Booking - {stageTitles[props.stage]}</h2>
                        { props.stageForwards ?
                            <TransitionGroup>
                                <CSSTransition
                                    key={props.stage}
                                    timeout={1300}
                                    classNames='booking-fade booking-fade-forwards'
                                >
                                    <div>
                                        <BookingStage notFilledIn={props.notFilledIn} name="Booking" photo={props.photo} stage={props.stage} handleEvent={props.handleEvent} handleInput={props.handleInput} inputs={props.inputs} />
                                    </div>
                                </CSSTransition>
                            </TransitionGroup> :
                            <TransitionGroup>
                                <CSSTransition
                                    key={props.stage}
                                    timeout={1300}
                                    classNames='booking-fade booking-fade-backwards'
                                >
                                    <div>
                                        <BookingStage notFilledIn={props.notFilledIn} name="Booking" photo={props.photo} stage={props.stage} handleEvent={props.handleEvent} handleInput={props.handleInput} inputs={props.inputs} />
                                    </div>
                                </CSSTransition>
                            </TransitionGroup>
                        }
                        <nav className="modal__booking-stage__nav">
                            { props.stage === 'one' ? 
                                <button onClick={props.handleEvent} data-func="prevStage" disabled>Previous</button> :
                                <button onClick={props.handleEvent} data-func="prevStage">Previous</button>
                            }
                            
                            { props.stage === 'five' ?
                                <button onClick={props.handleEvent} data-func="nextStage" disabled>Next</button> :
                                <button onClick={props.handleEvent} data-func="nextStage">Next</button>
                            }
                        </nav>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default BookingModal;