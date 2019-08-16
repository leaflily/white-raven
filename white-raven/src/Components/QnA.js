import React from 'react';

function QnA(props) {
    return (
        <div className="modal__qna__answers__dialog">
            <p className="modal__qna__answers__dialog__q">{props.q}</p>
            <p className="modal__qna__answers__dialog__a">{props.a}</p>
        </div>
    )
}

export default QnA;