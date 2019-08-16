import React from 'react';
import './Quote.css'

function Quote(props) {
    return ( 
        <figure aria-label="quote" className="quote">
            <p className="quote__text">
                {props.quote.text}<span className="hiddenPunctuation">,</span>
            </p>
            <p aria-label="author" className="quote__author">{props.quote.author}<span className="hiddenPunctuation">.</span></p>
        </figure>
    )
}

export default Quote;               