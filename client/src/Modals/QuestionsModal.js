import React, {useState, useRef, useEffect} from 'react';
import './modal.css';
import './QuestionsModal.css';
import MessageModal from '../Modals/MessageModal';
import QnAModal from '../Modals/QnAModal';

function QuestionsModal(props) {
    const [show, setShow] = useState('QnA');
    const start = useRef(null);
    useEffect(() => {
        start.current.focus();
    }, [show]);
    return (
         <div tabIndex="-1" ref={start} className="modal modal--qna" onClick={props.handleEvent} data-dest="Consultation" data-func="closeModal">
                <div className="modal__box">
                <button aria-label="close modal." className="modal__box__exit" onClick={props.handleEvent} data-dest="Consultation" data-func="closeModal">X</button>   
                    <div className="modal__box__content modal__questions">
                        <h1 className="modal__questions__title">Questions?</h1>
                        <div className="modal__questions__options">
                            <button className={'modal__questions__option '+(show === 'QnA' ? 'modal__questions__option--active' : '')} onClick={() => setShow('QnA')}>Q & A</button>
                            <button className={'modal__questions__option '+(show === 'Message' ? 'modal__questions__option--active' : '')} onClick={() => setShow('Message')}>Message Me</button>
                        </div>
                        <div className="modal__questions__box">
                        {
                            show === 'QnA' ? <QnAModal {...props} /> : <MessageModal {...props} />
                        }
                        </div>
                    </div>
                </div> 
            </div>
    )
}

export default QuestionsModal;

