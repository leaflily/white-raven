import React from 'react';
import './Status.css';
import Spinner from '../Components/Spinner';

function Status(props) {
    return (
        <div className={'status '+props.classNames}>
            <div className="status__spinner"><Spinner /></div>
            <div className="status__message">
                <h3>
                    {props.msg}
                    <span className="status__dots status__dots--1">.</span>
                    <span className="status__dots status__dots--2">.</span>
                    <span className="status__dots status__dots--3">.</span>
                </h3>
            </div>
            <div className="status__options">
                <button className="status__options__option status__options__cancel" aria-label="cancel" onClick={props.cancel}>Cancel</button>
                {props.alt.name && <button className="status__options__option status__options__alt" aria-label={props.alt.name} onClick={props.alt.handler}>{props.alt.name}</button>}
            </div>
            <button className="status__not-working status__options__option status__options__alt" onClick={props.help}>Not connecting?</button>
        </div>
    )
}

export default Status