import React, {useEffect, useRef} from 'react';
import './modal.css';
import './CodeOfEthicsModal.css';

function CodeOfEthicsModal(props) {
    const start = useRef(null);
    useEffect(() => {
        document.title = 'Code of Ethics - White Raven';
        start.current.focus();
    }, []);
    return (
        <div tabIndex="-1" ref={start} className="modal modal--CodeOfEthics" onClick={props.handleEvent} data-dest="Consultation" data-func="closeModal">
            <div className="modal__box">
            <button aria-label="close Code of Ethics modal" className="modal__box__exit" onClick={props.handleEvent} data-dest="Consultation" data-func="closeModal">X</button>
                <div className="modal__box__content modal__ethics">
                
                    <h1 className="modal__ethics__title">Code of Ethics for Interspecies Telepathic Communicators</h1>
                    <h2 className="modal__ethics__subtitle">Formulated in 1990 by Penelope Smith</h2>
                 
                    <p>Our motivation is compassion for all beings and a desire 
                        to help all species understand each other better, 
                        particularly to help restore the lost human ability to 
                        freely and directly communicate with other species.</p>
                    <p>We honor those that come to us for help, not judging, 
                        condemning, or invalidating them for their mistakes or 
                        misunderstanding but honoring their desire for change 
                        and harmony.</p>
                    <p>We know that to keep this work as pure and harmonious 
                        as possible requires that we continually grow spiritually. 
                        We realize that telepathic communication can be clouded 
                        or overlaid by our own unfulfilled emotions, critical 
                        judgments, or lack of love for self and others. We walk 
                        in humility, willing to recognize and clear up our own 
                        errors in understanding others’ communication (human 
                        and non-human alike).</p>
                    <p>We cultivate knowledge and understanding of the dynamics 
                        of human, non-human, and interspecies behavior and 
                        relationships, to increase the good results of our 
                        work. We get whatever education and/or personal help 
                        we need to do our work effectively, with compassion, 
                        respect, joy, and harmony.</p>
                    <p>We seek to draw out the best in everyone and increase 
                        understanding toward mutual resolution of problems. 
                        We go only where we are asked to help, so that others 
                        are receptive and we truly can help. We respect the 
                        feelings and ideas of others and work for interspecies 
                        understanding, not pitting one side against another 
                        but walking with compassion for all. We acknowledge 
                        the things that we cannot change and continue where 
                        our work can be most effective.</p>
                    <p>We respect the privacy of people and animal companions 
                        we work with, and honor their desire for 
                        confidentiality.</p>
                    <p>While doing our best to help, we allow others their 
                        own dignity and help them to help their animal 
                        companions. We cultivate understanding and ability 
                        in others, rather than dependence on our ability. 
                        We offer people ways to be involved in understanding 
                        and growth with their fellow beings of other species.</p>
                    <p>We acknowledge our limitations, seeking help from other 
                        professionals as needed. It is not our job to name and 
                        treat diseases, and we refer people to veterinarians 
                        for diagnosis of physical illness. We may relay animals’ 
                        ideas, feelings, pains, symptoms, as they describe
                         them or as we feel or perceive them, and this may be 
                         helpful to veterinary health professionals. 
                         We may also assist through handling of stresses, 
                         counseling, and other gentle healing methods. 
                         We let clients decide for themselves how to work with 
                         healing their animal companions’ distress, disease, or 
                         injury, given all the information available.</p>
                    <p>The goal of any consultation, lecture, workshop, or 
                        interspecies experience is more communication, 
                        balance, compassion, understanding, and communion 
                        among all beings. We follow our heart, honoring 
                        the spirit and life of all beings as One.</p>
                </div>
            </div>  
        </div>
    )
}

export default CodeOfEthicsModal;