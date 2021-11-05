import React from 'react';
// import Paypal from '../Components/Paypal';
import Input from '../Components/Input';
import Textarea from '../Components/Textarea';
import Select from '../Components/Select';
import Spinner from '../Components/Spinner';


function BookingStage(props) {
    const uploadImgStyle = {
        backgroundImage: `url(${props.photo || props.uploadedPhoto})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
    const stages = {
        'Start': <form className="modal__booking-stage__form modal__booking-stage__form--about">
                <h3>To book a consultation please prepare: </h3>
                <ul>
                    <li>A clear recent photo of your animal on its own (with eyes showing)</li>
                    <li>The animals name, age, and gender</li>
                    <li>A communication focus, the main reason for wanting the communication</li>
                    <li>Other concerns/questions/messages you have for your animal friend (optional)</li>
                </ul>
                <Select className="select_service" invalid={props.invalid} dataName="services" onChange={props.handleInput} value={props.inputs['services']}
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
                <div className="modal__booking-stage__form__photo-upload">
                    <div className="modal__booking-stage__form__photo-upload__area">
                        <div className="modal__booking-stage__form__photo-upload__area__img" style={uploadImgStyle} alt="" />
                        <Input key={props.uploadPhotoCancelKeyCount} aria-label="Upload photo" inputs={props.inputs} invalid={props.invalid} dataName="photo" onChange={props.handleInput} type="file" />
                    </div>
                    <p className="modal__booking-stage__form__photo-upload__info">Clear recent photo (alone, with eyes visible)</p>
                </div>    
                <div className="modal__booking-stage__form__animal-info">
                    <Input invalid={props.invalid} className="modal__booking-stage__form__animal-info__area" type="text" aria-label="Animal's Name" placeholder="Animal's Name" dataName="name" onChange={props.handleInput} value={props.inputs['name']} />
                    <div>
                        <Input invalid={props.invalid} dataName="age" onChange={props.handleInput} value={props.inputs['age']} type="number" aria-label="Age" placeholder="Age" className="modal__booking-stage__form__animal-info__age" />
                        <Select invalid={props.invalid} dataName="ageValue" onChange={props.handleInput} value={props.inputs['ageValue']}
                            options={<><option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option></>}
                        />
                    </div>
                    <Select invalid={props.invalid} className="placeholdered" dataName="gender" onChange={props.handleInput} value={props.inputs['gender']}
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
                            value={props.inputs['quietTimes']} 
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
                <Textarea invalid={props.invalid} dataName="reason" value={props.inputs['reason']} onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" aria-label="Main reason for communication" placeholder="Main reason for communication" />
                <Textarea invalid={props.invalid} dataName="otherQuestions" value={props.inputs['otherQuestions']} onChange={props.handleInput} className="modal__booking-stage__form__animal-info__text-area" aria-label="(optional) Other concerns/questions/messages you have for your animal friend" placeholder="Other concerns/questions/messages you have for your animal friend (optional)" />
            </form>
        ,
        'Your Info': <form className="modal__booking-stage__form modal__booking-stage__form--your-info" autoComplete="on">
                <Input invalid={props.invalid} dataName="clientName" onChange={props.handleInput} value={props.inputs['clientName']} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Your name" aria-label="Your name" name="name" />
                <Input invalid={props.invalid} dataName="clientEmail" onChange={props.handleInput} value={props.inputs['clientEmail']} className="modal__booking-stage__form__animal-info__area" type="email" placeholder="Email" aria-label="Email" name="email" />
                <Input invalid={props.invalid} dataName="clientNumber" onChange={props.handleInput} value={props.inputs['clientNumber']} className="modal__booking-stage__form__animal-info__area" type="text" placeholder="Skype or Phone Number" aria-label="Skype or Phone Number" name="tel" />
            </form>
        ,
        'Sending': <form className="modal__booking-stage__form modal__booking-stage__form--sending">
                <Spinner />
            </form>
        ,
        'Confirmation': <form className="modal__booking-stage__form modal__booking-stage__form--confirmation">
                <div>
                    <h2>Congratulations!</h2>
                    <p>Your booking infomation has been recieved successfully.</p>
                    <p>I will be in touch soon with the next available dates and times, along with payment details.</p>
                    <h3>Thank You.</h3>
                </div>
            </form>
    };
    return stages[props.stage]
}

export default BookingStage;