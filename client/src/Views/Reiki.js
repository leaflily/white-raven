import React, {useEffect, useRef} from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Image from '../Components/Image';
import practofexc2022 from '../images/practofexc2022.png';
import practofexc2020 from '../images/practofexc2020.png';
import './main.css';
import './Reiki.css';

function Reiki() {
    const quote = {
        text: <q>Compassion is a Verb</q>,
        author: 'Thich Nhat Hanh'
    } 
    const start = useRef(null);
    useEffect(() => {
        document.title = 'Reiki - White Raven';
        start.current.focus();
    }, []);
    return (
        <div tabIndex="-1" ref={start}>
            <Header page="reiki" quote={quote} />
            <main id="reiki" role="main" className="main main--reiki">
                <div className="main__section-background main__section-background--blue">
                    <article className="main__section">
                        <p className="main__section__p">
                            <span role="heading" aria-level="1" className="main__section__p__headline">Reiki<span className="hiddenPunctuation">, </span></span> 
                            is a complementary therapy. 
                        </p>
                        <p className="main__section_p">
                            With its roots in Japanese origin, the word Reiki comes from two Japanese words: 
                            Rei -  'Universal Life'   Ki - 'Energy'.  Reiki -  is the unseen life energy that 
                            flows through all living things.
                        </p>
                        <p className="main__section__p">
                        Reiki is a gentle, non-invasive and effective system that helps to activate the body’s 
                        own natural ability to heal itself, restoring balance and harmony. It treats the whole person, 
                        body, mind and spirit. <br />
                        Animal reiki works in the same way to help balance and nourish the physical, mental and emotional 
                        energy. It can be used as a therapy on its own or to work in conjunction with veterinary and other 
                        therapeutic techniques to relieve side effects and promote recovery.
                        </p>
                        <figure className="main__section__figure main__section__figure--tablet main__section__figure--Dog image">
                            <Image fileName="dog.jpg" sizeShifts={[0, 500, 750, 1000]} alt="a dog sleeping." />
                        </figure>
                    </article>
                </div>
                <div className="main__section-background main__section-background--orange">
                    <aside className="main__section main__section--orange">
                        <p className="main__section__p"> 
                            A Reiki practitioner when they are working on a human will use a sequence of hand positions on or 
                            just off the body with the therapist moving around the person directing the reiki energy.
                        </p>
                        <p className="main__section__p">
                            Animals are much more sensitive to this Reiki energy, the technique I trained in is taught by Kathleen 
                            Prasad - ‘Let animals lead’ way of offering reiki. Where the animal reiki practitioner will stay still 
                            and will not direct the Reiki energy to the animal but instead holds a Reiki space for the animal to 
                            come into,  they are free to take as much of Reiki energy as they need,  physical contact is not 
                            necessary unless the animal shows that is what they want.
                        </p>
                        <figure className="main__section__figure main__section__figure--certs">
                            <img src={practofexc2022} alt="Let Animals Lead - Practitioner of Excellence 2022" />
                            <img src={practofexc2020} alt="Let Animals Lead - Practitioner of Excellence 2020" />
                        </figure>
                        <p className="main__section__p">
                            Animal reiki is a wonderful, gentle, non obtrusive way to help our animal 
                            companions. Many animals become more relaxed, and some will go into what 
                            appears a deep sleep which can last for a while after the reiki session 
                            has ended.
                            <br />
                            It can be offered in person with your animal friend present, or at distance 
                            through a photo; there is no difference in the effectiveness of the reiki 
                            offered, both ways work well as reiki is an unseen life energy that flows 
                            through all life.
                        </p>
                        <p className="main__section__p">
                            Animal Reiki is different from Animal Communication where exchange of information is actively sought.
                            <br />
                            With animal reiki, a reiki energy space is held, it is a quiet peaceful time for your animal friend to relax and accept as much of the Reiki energy as they need, it's important during the session that they can move around and come and go as they choose.
                            <br />
                            While a session is happening you do not need to do anything or even be with them, of course you are welcome to enjoy sharing this time sitting quietly with them.
                        </p>
                        <p className="main__section__p">
                            After a few days have passed I will check-in with you to see how your animal friend is doing, and of course you are always welcome to contact me at any time before this if you have any questions or concerns.
                        </p>
                        <p className="main__section__p">
                            Only distant animal Reiki sessions are being offered at the moment. 
                        </p>
                    </aside>
                </div>
            </main>
            <Nav page="reiki" />
        </div>
    )
}

export default Reiki;