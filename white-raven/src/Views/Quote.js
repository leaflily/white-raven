import React from 'react';
import './Quote.css'

function Quote(props) {
    return ( 
        <figure className="quote">
            <p className="quote__text">
                {props.quote.text}
            </p>
            <p className="quote__author">{props.quote.author}</p>
        </figure>
    )
}

export default Quote;