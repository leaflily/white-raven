import React from 'react';

function BookingStage(props) {
    const stages = {
        one: {
            title: 'Animal Info',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--animal-info">
                <div className="modal__booking-stage__form__photo-upload">
                    <div className="modal__booking-stage__form__photo-upload__area">
                        <img src={props.photo} alt="" />
                        <input data-name="photo" onChange={props.handleInput} type="file" />
                    </div>
                    <p className="modal__booking-stage__form__photo-upload__info">Clear recent photo (alone, with eyes visible)</p>
                </div>    
                <div className="modal__booking-stage__form__animal-info">
                    <input className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Name" data-name="name" onChange={props.handleInput} value={props.inputs['name']} />
                    <div className="modal__booking-stage__form__animal-info__area">
                        <div>
                            <input data-name="age" onChange={props.handleInput} value={props.inputs['age']} type="number" placeholder="Age" className="modal__booking-stage__form__animal-info__age" />
                            <select data-name="ageValue" onChange={props.handleInput} value={props.inputs['ageValue']}>
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <select className="placeholdered" data-name="gender" onChange={props.handleInput} value={props.inputs['gender']}>
                            <option disabled hidden value="gender">Gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="both">Both</option>
                            <option value="neither">Neither</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <input data-name="home" onChange={props.handleInput} value={props.inputs['home']} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Home" />
                    <textarea data-name="familyMembers" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" contentEditable placeholder="Family Members">{props.inputs['familyMembers']}</textarea>
                </div>
                <div className="modal__booking-stage__form__background-info">
                    <textarea data-name="backgroundInfo" onChange={props.handleInput} className="modal__booking-stage__form__background-info__text-area" contentEditable placeholder="Background information (any trama, medication, illness...)">{props.inputs['backgroundInfo']}</textarea>
                </div>
               
            </form>
            },
        two: {
            title: 'Focus',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--focus">
                <textarea data-name="reason" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" contentEditable placeholder="Main reason for communication">{props.inputs['reason']}</textarea>
                <textarea data-name="otherQuestions" onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" contentEditable placeholder="Other concerns/questions/messages you have for your animal friend">{props.inputs['otherQuestions']}</textarea>
            </form>
        },
        three: {
            title: 'Your Info',
            content: <form className="modal__booking-stage__form modal__booking-stage__form--your-info">
                <input className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Name" data-name="yourName" onChange={props.handleInput} value={props.inputs['yourName']} />
                <input className="modal__booking-stage__form__animal-info__area" type="email" placeholder="Email" data-name="email" onChange={props.handleInput} value={props.inputs['email']} />
                <input className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Skype or Phone Number" data-name="phone" onChange={props.handleInput} value={props.inputs['phone']} />
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
                <button onClick={props.handleEvent} data-func="prevStage">Previous</button>
                <button onClick={props.handleEvent} data-func="nextStage">Next</button>
            </nav>
        </div>
    )
}

export default BookingStage;