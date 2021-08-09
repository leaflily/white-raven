import React, {useEffect, useRef} from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Image from '../Components/Image';
import './main.css';
import './Reiki.css';

function Reiki() {
    const quote = {
        text: '',
        author: ''
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
                            is a complementary healing therapy.
                            With its roots in Japanese origin, the word Reiki comes from 
                            two Japanese words: Rei - meaning 'Universal Life' and Ki - 
                            meaning 'Energy'. Reiki is the unseen life energy that flows 
                            through all living things.
                        </p>
                        <p className="main__section__p">
                            Reiki is a gentle, non-invasive and effective system of healing 
                            that helps to activate the body’s own natural ability to heal itself, 
                            restoring balance and harmony. It treats the whole person, body, 
                            mind and spirit. Animal reiki works in the same way to balance and 
                            nourish the physical body and to balance mental and emotional energy. 
                            It can be used as a therapy on its own or to work in conjunction with 
                            veterinary and other therapeutic techniques to relieve side effects 
                            and promote recovery.
                        </p>
                        <figure className="main__section__figure main__section__figure--tablet main__section__figure--Dog image">
                            <Image fileName="dog.jpg" sizeShifts={[0, 500, 750, 1000]} alt="a dog sleeping." />
                        </figure>
                    </article>
                </div>
                <div className="main__section-background main__section-background--orange">
                    <aside className="main__section main__section--orange">
                        <p className="main__section__p"> 
                            Reiki is reiki! The only difference between human and animal reiki is 
                            the way it looks as a practitioner works with the human or with an animal. 
                            <br />
                            With human reiki, we use a sequence of hand positions on or just off the body, 
                            and the therapist moves around the person directing the reiki energy.
                        </p>
                        <figure class="main__section__figure">
                            <img src="" alt="Let Animals Lead - Practitioner of Excellence 2021" />
                        </figure>
                        <p className="main__section__p">
                            Because animals are more sensitive to this energy, I use the ‘Let Animals 
                            Lead’ - Kathleen Prasad way of offering reiki, staying still and quiet, 
                            letting the animal come into the reiki space/energy field to receive as 
                            much or as little as they need; in this way, they lead the session and are 
                            free to come and go throughout it. It is up to the animal to show if they 
                            want hands-on or not.
                        </p>
                        <p className="main__section__p">
                            As an animal reiki practitioner I will hold a reiki energy space.
                        </p>
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
                            If you would like to book a session for your animal friend please go to 
                            'Booking a distant Reiki Session.' (add link)
                        </p>
                    </aside>
                </div>
            </main>
            <Nav page="reiki" />
        </div>
    )
}

export default Reiki;