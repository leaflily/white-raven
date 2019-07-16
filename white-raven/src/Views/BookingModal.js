import React from 'react';
import BookingStage from './BookingStage';
import './BookingModal.css';

function BookingModal(props) {
    return (
        <div className="modal modal--Booking" onClick={props.handleEvent} data-func="closeModal">
            <div className="modal__box">
                <div className="modal__box__exit" onClick={props.handleEvent} data-func="closeModal">X</div>   
                <div className="modal__box__content">
                    <BookingStage name="Booking" photo={props.photo} stage={props.stage} handleEvent={props.handleEvent} handleInput={props.handleInput} inputs={props.inputs} />
                </div>
            </div>  
        </div>
    )
}

export default BookingModal;