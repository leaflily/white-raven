import React, {useState, useEffect, useRef} from 'react';

function Input(props) {
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
   return <input 
      {...p} 
      {...alert}
      ref={focusInput}
      data-name={dataName}
      className={className+' '+classNames}
   />
}

export default Input
