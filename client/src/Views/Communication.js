import React, {useEffect, useRef} from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Image from '../Components/Image';
import './main.css';
import './Communication.css';

function Communication() {
    const quote = {
        text: '"Some people talk to animals not many listen though, that’s the problem"',
        author: 'A A Milne'
    } 
    const start = useRef(null);
    useEffect(() => {
        document.title = 'Communication  - White Raven';
        start.current.focus();
    }, []);
    return (
        <div tabIndex="-1" ref={start}>
            <Header page="communication" quote={quote} />
            <main id="communication" role="main" className="main main--communication">
                <div className="main__section-background main__section-background--blue">
                    <article className="main__section">
                        <p className="main__section__p">
                            <span role="heading" aria-level="1" className="main__section__p__headline">Animal Communication<span className="hiddenPunctuation">, </span></span> 
                            involves a telepathic, non-verbal way of interacting; 
                            using intentions and visualisations, I receive a 
                            heartfelt intuition and possibly a ‘sudden knowing' 
                            about an animal's viewpoint, thoughts, and feelings. 
                            This focusing energy facilitates a 2-way exchange of 
                            important information. Physical proximity is not required.
                        </p>
                        <figure className="main__section__figure main__section__figure--tablet main__section__figure--Dolphin image">
                            <Image fileName="dolphin.jpg" sizeShifts={[0, 1059]} className="" alt="a lady underwater eye to eye with a dolphin." />
                        </figure>
                        <p className="main__section__p"> 
                        Using this silent but universal or interspecies ‘language', 
                        I can act as an interpreter, a bridge between the animal 
                        and carer. <br />
                        Depending on the reason for seeking help, I assist guardians 
                        in helping their animals by using brief information and a 
                        photograph, and in many cases, solutions are often found.
                        </p>
                    </article>
                </div>
                <figure className="main__figure main__figure--Dolphin-mobile image">
                    <Image fileName="dolphin.jpg" sizeShifts={[0, 220, 420]} className="" alt="a lady underwater eye to eye with a dolphin." />
                </figure>
                <div className="main__section-background main__section-background--orange">
                    <aside className="main__section main__section--orange">
                        <h2 className="main__section__list-heading">Consultations are available for:</h2>
                        <ul className="main__section__list__ul">
                            <li>
                                Trauma, abuse, stored memories
                            </li>
                            <li>
                                End of life decisions and care
                            </li>
                            <li>
                                Grief and coping with loss
                            </li>
                            <li>
                                Communicating with wildlife
                            </li>
                            <li>
                                Contacting animal's spirit after death
                            </li>
                            <li>
                                Behaviour and training issues; altered behavior, 
                                distress, aggression, fears
                            </li>
                            <li>
                                Family transition, abandonment, additional pets, 
                                babies, other family members
                            </li>
                            <li>
                                Environmental change, travel, emigration 
                            </li>
                            <li>
                                Health, illness, disease (healing is always in 
                                conjunction with veterinary care: please note 
                                I am not a vet and cannot diagnose but can 
                                express what I'm shown and receive from your 
                                animal friend) 
                            </li>
                        </ul>
                        <p className="main__section__p main__section__p--last">
                            Something I find so precious about working with animal 
                            communication is when guardians/carers discover an 
                            enriched and deeper relationship with their animal 
                            friends. Through shared knowledge and mutual 
                            understanding, we move from concern, depression or 
                            grief to balance, well-being and harmony.
                        </p>
                    </aside>
                </div>
            </main>
            <Nav page="communication" />
        </div>
    )
}

export default Communication;