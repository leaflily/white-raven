
import Link from 'next/link';
import { Fragment } from 'react';

export default function LinkButton({href, children, as = href, colour = 'blue', size = 'medium'}) {
    const sizes = {
        large: {
            fontSize: '16px',
            width: '260px',
            maxWidth: '80vw',
            height: '60px'
        },
        medium: {
            fontSize: '14px',
            width: '220px',
            maxWidth: '70vw',
            height: '50px'
        },
        small: {
            fontSize: '12px',
            width: '195px',
            maxWidth: '60vw',
            height: '40px'
        },
        'x-small': {
            fontSize: '10px',
            width: '150px',
            maxWidth: '50vw',
            height: '30px'
        }
    };
    const {fontSize, width, maxWidth, height} = sizes[size];
    return (<Fragment>
        <Link href={href} as={as}>
            <a>
                {children}
            </a>
        </Link>
        <style jsx>{`
        a {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 8px;
            color: #ffffff;
            border: 1px solid #ffffff;
            border-radius: 10px;
            font-family: normal 700 delve-hand, cursive, sans-serif;
            font-size: ${fontSize};
            letter-spacing: 0.102em;
            text-shadow: 1px 1px 1px #6698CC;
            text-align: center;
            text-decoration: none;
            background: var(--colour-${colour});
            width: ${width};
            max-width: ${maxWidth};
            height: ${height};
        }
    `}</style>
    </Fragment>)
}