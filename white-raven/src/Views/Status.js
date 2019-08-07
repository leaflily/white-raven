import React from 'react';
import './Status.css';
import Spinner from './Spinner';

function Status(props) {
    return (
        <div className={'status '+props.classNames}>
            <Spinner />
            <div className="status__message">
                <h3>
                    {props.msg}
                    <span className="status__dots status__dots--1">.</span>
                    <span className="status__dots status__dots--2">.</span>
                    <span className="status__dots status__dots--3">.</span>
                </h3>
            </div>
            <div className="status__options">
                <div className="status__options__cancel" onClick={props.cancel}>Cancel</div>
                {props.altOption && <div className="status__options__alt" onClick={props.altOption.handler}>{props.altOption.name}</div>}
            </div>
        </div>
    )
}

export default Status