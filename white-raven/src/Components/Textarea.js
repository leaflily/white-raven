import React, {useState, useRef, useEffect} from 'react';

function Textarea(props) {
    var focusInput = useRef();
    const {className, dataName, inputs, ...p} = props;
    const [classNames, setClassNames] = useState('');
    const [alert, setAlert] = useState({});
    const valid = props.dataName === props.invalid;
    const setValidity = () => {
       setClassNames(props.dataName === props.invalid ? 'required required-out' : '');
       setAlert(props.dataName === props.invalid ? { role:"alert" } : {});
       props.dataName === props.invalid && focusInput.current.focus();
    }  
    useEffect(setValidity, [valid]);
    return <textarea
       {...p} 
       {...alert}
       ref={focusInput}
       data-name={dataName}
       className={className+' '+classNames}></textarea>
}

export default Textarea