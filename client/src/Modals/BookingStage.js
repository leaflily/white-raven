import React from 'react';
// import Paypal from '../Components/Paypal';
import Input from '../Components/Input';
import Textarea from '../Components/Textarea';
import Select from '../Components/Select';


function BookingStage(props) {
    const { name, age, ageValue, gender, reason, otherQuestions, clientName, clientNumber, quietTimes, services } = props.inputs;
    const getEmailBody = () => {
        const newLine = '\r\n';
        return (
`Hello Denise, ${newLine}I'd like to make a booking for ${services} ${newLine}${newLine}Animal Name: ${name} ${newLine}Gender: ${gender} ${newLine}Age: ${age} ${ageValue} ${newLine}${quietTimes ? `Quiet at: ${quietTimes} ${newLine}` : ''}Reason for Communication: ${reason} ${newLine} ${newLine}${otherQuestions ? `Other Questions: ${otherQuestions} ${newLine} ${newLine}` : ''}Please find a clear and recent photo of ${name} attached. ${newLine}Let me know if I've forgotten to attach this! ${newLine} ${newLine}Kind regards${clientName || clientNumber ? ',' : ''} ${newLine}${clientName ? clientName : ''}${clientName && clientNumber ? ' | ' : ''}${clientNumber ? clientNumber : ''}`
        )
    };

    const stages = {
        'Start': <form className="modal__booking-stage__form modal__booking-stage__form--about">
                <h3>To book a consultation please prepare: </h3>
                <ul>
                    <li>The animals name, age, and gender</li>
                    <li>A communication focus, the main reason for wanting the communication</li>
                    <li>Other concerns/questions/messages you have for your animal friend (optional)</li>
                    <li>A clear recent photo of your animal on its own (with eyes showing. Please send this as a reply to the email confirmation)</li>
                </ul>
                <Select className="select_service" invalid={props.invalid} dataName="services" onChange={props.handleInput} value={services}
                    options={<>
                        <option value="">Select a service</option>
                        <option value="Animal Communication">Animal Communication</option>
                        <option value="Reiki x1">Reiki x1</option>
                        <option value="Reiki x3">Reiki x3</option>
                        <option value="Animal Communication + Reiki x1">Animal Communication + Reiki x1</option>
                        <option value="Animal Communication + Reiki x3">Animal Communication + Reiki x3</option>

                    </>}
                />
                {props.inputs.services && props.inputs.services.match(/communication/i) &&
                    <p>An animal communication costs £85 per animal. This covers a distance communication (45mins) + Skype or telephone call for feedback (45mins)</p>
                }
                { props.includesReiki && (props.inputs.services && props.inputs.services.match(/x3/i) ?
                    <p>Three 30 minute Reiki sessions costs £80, to be used within 3 months.</p> :
                    <p>One 30 minute Reiki session costs £30.</p>
                )}
                {props.inputs.services && (<>
                    <p>Cancellation policy - cancellation can be made for any reason, up to 48 hours before a session, a full refund will be issued if bank transfer use for payment or less Paypal's fee if
                    Paypal was used for payment.
                    After 48 hours before a session no refund can be issued.
                    </p>
                    <p>If for any reason I have to cancel a session, a choice of a full refund or rebooking another date will be offered.</p>
                </>)
            }
            </form>
        ,
        'Animal Info': <form className="modal__booking-stage__form modal__booking-stage__form--animal-info">
                <div className="modal__booking-stage__form__animal-info">
                    <Input invalid={props.invalid} className="modal__booking-stage__form__animal-info__area" type="text" aria-label="Animal's Name" placeholder="Animal's Name" dataName="name" onChange={props.handleInput} value={name} />
                    <div>
                        <Input invalid={props.invalid} dataName="age" onChange={props.handleInput} value={age} type="number" aria-label="Age" placeholder="Age" className="modal__booking-stage__form__animal-info__age" />
                        <Select invalid={props.invalid} dataName="ageValue" onChange={props.handleInput} value={ageValue}
                            options={<><option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option></>}
                        />
                    </div>
                    <Select invalid={props.invalid} className="placeholdered" dataName="gender" onChange={props.handleInput} value={gender}
                        options={<><option disabled hidden value="gender">Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="both">Both</option>
                        <option value="neither">Neither</option>
                        <option value="other">Other</option></>}
                    />
                    { props.includesReiki && 
                        <Textarea 
                            invalid={props.invalid} 
                            dataName="quietTimes" 
                            value={quietTimes} 
                            onChange={props.handleInput} 
                            className="modal__booking-stage__form__animal-info__text-area" 
                            aria-label="Times of day your animal is more quiet. Please include your timezone." 
                            placeholder="Times of day your animal is more quiet. Please include your timezone." 
                        />
                    }
               </div>
            </form>
        ,
        'Focus': <form className="modal__booking-stage__form modal__booking-stage__form--focus">
                <Textarea invalid={props.invalid} dataName="reason" value={reason} onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" aria-label="Main reason for communication" placeholder="Main reason for communication" />
                <Textarea invalid={props.invalid} dataName="otherQuestions" value={otherQuestions} onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" aria-label="(optional) Other concerns/questions/messages you have for your animal friend" placeholder="Other concerns/questions/messages you have for your animal friend (optional)" />
            </form>
        ,
        'Your Info': <form className="modal__booking-stage__form modal__booking-stage__form--your-info" autoComplete="on">
                <Input invalid={props.invalid} dataName="clientName" onChange={props.handleInput} value={clientName} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Your name" aria-label="Your name" name="name" />
                <Input invalid={props.invalid} dataName="clientNumber" onChange={props.handleInput} value={clientNumber} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Skype or Phone Number (optional)" aria-label="Skype or Phone Number" name="tel" />
            </form>
        ,
        'Send': <form className="modal__booking-stage__form modal__booking-stage__form--sending">
                <div>
                    <p>Booking for: {services}</p>
                    <p>Animal Name: {name}</p>
                    <p>Gender: {gender}</p>
                    <p>Age: {ageValue}</p>
                    <p>Quiet at: {quietTimes}</p>
                    <p>Reason for Communication: {reason}</p>
                    <p>{otherQuestions ? `Other Questions: ${otherQuestions}` : ''}</p>
                    <p>{clientNumber ? `Contact number: ${clientNumber}` : ''}</p>
                </div>
                <a className="email_link" href={`mailto:white3raven@gmail.com?subject=${encodeURIComponent(`White Raven - Booking for ${services} with ${name}`)}&body=${encodeURIComponent(getEmailBody())}`} title="Opens your email application">
                    Email your booking
                </a>
            </form>
    };
    return stages[props.stage]
}

export default BookingStage;