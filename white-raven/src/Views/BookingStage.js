import React from 'react';

class Input extends React.Component {
    notFilledIn = this.props.dataName === this.props.notFilledIn;
 input = () => {
  const {className, notFilledIn, dataName, inputs, ...p} = this.props;
  const ref = { ref: (input) => { return this.focusInput = input} }
  if (!notFilledIn) {
      delete ref.ref;
  }
  return <input 
        {...p} 
        {...ref}
        data-name={dataName}
        className={`${this.props.hasOwnProperty('className') ? this.props.className : ''} ${this.notFilledIn ? 'required' : ''}`}
    />
 }
 componentDidUpdate() {
    this.notFilledIn = this.props.dataName === this.props.notFilledIn;
    this.notFilledIn && this.focusInput.focus();
 }
 render() {
    return this.input()
 }
}

class Textarea extends React.Component {
    notFilledIn = this.props.dataName === this.props.notFilledIn;
    input = () => {
        const {className, notFilledIn, dataName, inputs, ...p} = this.props;
        const ref = { ref: (input) => { return this.focusInput = input} }
        if (!notFilledIn) {
            delete ref.ref;
        }
        return <textarea 
           {...p}
           {...ref}
           data-name={dataName} 
           className={`${this.props.hasOwnProperty('className') ? className : ''} ${this.notFilledIn ? 'required' : ''}`}
           value={inputs[dataName]}></textarea>
    }
    componentDidUpdate() {
        this.notFilledIn = this.props.dataName === this.props.notFilledIn;
        this.notFilledIn && this.focusInput.focus();
     }
    render() {
       return this.input()
    }
}

class Select extends React.Component {
    notFilledIn = this.props.dataName === this.props.notFilledIn;
    input = () => {
        const {className, notFilledIn, dataName, inputs, options, ...p} = this.props;
        const ref = { ref: (input) => { return this.focusInput = input} }
        if (!notFilledIn) {
            delete ref.ref;
        }
        return <select 
           {...p}
           {...ref}
           data-name={dataName} 
           className={`${this.props.hasOwnProperty('className') ? className : ''} ${this.notFilledIn ? 'required' : ''}`}
           >{options}</select>
    }
    componentDidUpdate() {
        this.notFilledIn = this.props.dataName === this.props.notFilledIn;
        this.notFilledIn && this.focusInput.focus();
     }
    render() {
       return this.input()
    }
}

function BookingStage(props) {
    const stages = {
        one: {
            title: 'Animal Info',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--animal-info">
                <div className="modal__booking-stage__form__photo-upload">
                    <div className="modal__booking-stage__form__photo-upload__area">
                        <img src={props.photo} alt="" />
                        <Input notFilledIn={props.notFilledIn} dataName="photo" onChange={props.handleInput} type="file" />
                    </div>
                    <p className="modal__booking-stage__form__photo-upload__info">Clear recent photo (alone, with eyes visible)</p>
                </div>    
                <div className="modal__booking-stage__form__animal-info">
                    <Input inputs={props.inputs} notFilledIn={props.notFilledIn} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Name" dataName="name" onChange={props.handleInput} value={props.inputs['name']} />
                    <div className="modal__booking-stage__form__animal-info__area">
                        <div>
                            <Input inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="age" onChange={props.handleInput} value={props.inputs['age']} type="number" placeholder="Age" className="modal__booking-stage__form__animal-info__age" />
                            <Select notFilledIn={props.notFilledIn} dataName="ageValue" onChange={props.handleInput} value={props.inputs['ageValue']}
                                options={<><option value="years">Years</option>
                                <option value="months">Months</option>
                                <option value="days">Days</option></>}
                            />
                        </div>
                        <Select notFilledIn={props.notFilledIn} className="placeholdered" dataName="gender" onChange={props.handleInput} value={props.inputs['gender']}
                            options={<><option disabled hidden value="gender">Gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="both">Both</option>
                            <option value="neither">Neither</option>
                            <option value="other">Other</option></>}
                        />
                    </div>
                    <Input inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="home" onChange={props.handleInput} value={props.inputs['home']} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Home" />
                    <Textarea inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="familyMembers" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" placeholder="Family Members" />
                </div>
                <div className="modal__booking-stage__form__background-info">
                    <Textarea inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="backgroundInfo" onChange={props.handleInput} className="modal__booking-stage__form__background-info__text-area" placeholder="Background information (any trama, medication, illness...)" />
                </div>
               
            </form>
            },
        two: {
            title: 'Focus',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--focus">
                <Textarea inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="reason" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" placeholder="Main reason for communication" />
                <Textarea inputs={props.inputs} notFilledIn={props.notFilledIn} dataName="otherQuestions" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" placeholder="Other concerns/questions/messages you have for your animal friend" />
            </form>
        },
        three: {
            title: 'Your Info',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--your-info">
                <Input inputs={props.inputs} notFilledIn={props.notFilledIn} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Name" dataName="yourName" onChange={props.handleInput} value={props.inputs['yourName']} />
                <Input inputs={props.inputs} notFilledIn={props.notFilledIn} className="modal__booking-stage__form__animal-info__area" type="email" placeholder="Email" dataName="email" onChange={props.handleInput} value={props.inputs['email']} />
                <Input inputs={props.inputs} notFilledIn={props.notFilledIn} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Skype or Phone Number" dataName="phone" onChange={props.handleInput} value={props.inputs['phone']} />
            </form>
        },
        four: {
            title: 'Payment',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--payment">
                    <button className="modal__booking-stage__form__payment-button"><h3>Pay Now</h3></button>
                </form>
        }
    };
    return (
        <div className={'modal__booking-stage modal__booking-stage--'+props.stage}>
            <h2 className="modal__booking-stage__title">Booking - {stages[props.stage].title}</h2>
            {stages[props.stage].content}
            <nav className="modal__booking-stage__nav">
                { props.stage === 'one' ? 
                    <button onClick={props.handleEvent} data-func="prevStage" disabled>Previous</button> :
                    <button onClick={props.handleEvent} data-func="prevStage">Previous</button>
                }
                
                { props.stage === 'four' ?
                    <button onClick={props.handleEvent} data-func="nextStage" disabled>Next</button> :
                    <button onClick={props.handleEvent} data-func="nextStage">Next</button>
                }
                
            </nav>
        </div>
    )
}

export default BookingStage;