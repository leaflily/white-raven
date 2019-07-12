import React from 'react';
import Header from './Header';
import Nav from './Nav';
import dolphin from './images/dolphin.jpg';
import './main.css';
import './Communication.css';

function Communication() {
    const quote = {
        text: '"Some people talk to animals not many listen though, that’s the problem"',
        author: 'A A Milne.'
    }
    return (
        <>
            <Header page="communication" quote={quote} />
            <main className="main main--communication">
                <div className="main__section-background main__section-background--blue">
                    <section className="main__section">
                        <p className="main__section__p">
                            <span className="main__section__p__headline">Animal communication </span> 
                            Involves a telepathic, non-verbal way of interacting. 
                            Using intentions and visualisations, I receive a 
                            heart-felt intuition and possibly a ‘sudden knowing’ 
                            about an animal’s viewpoint, thoughts and feelings.
                            This focusing energy facilitates a 2-way exchange of 
                            important information. <br />
                            Physical proximity is not required.
                        </p>
                        <figure className="main__section__figure main__section__figure--tablet main__section__figure--Dolphin">
                            <img className="pre-img" src={dolphin} alt="lady swimming with a dolphin" />
                        </figure>
                        <p className="main__section__p"> 
                            Using this silent but universal or interspecies ‘language’, 
                            I can act as an interpreter, a bridge between the animal 
                            and carer. <br />
                            Depending on the reason for seeking help, 
                            I assist guardians in helping their individual animals by 
                            using brief information and a photograph, and in many cases, 
                            solutions are often found.
                        </p>
                    </section>
                </div>
                <figure className="main__figure main__figure--Dolphin-mobile">
                        <img src={dolphin} alt="lady swimming with a dolphin" />
                </figure>
                <div className="main__section-background main__section-background--orange">
                    <section className="main__section main__section--orange">
                        <h3 className="main__section__list-heading">Consultations are available for:</h3>
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
                                Contacting animal spirits
                            </li>
                            <li>
                                Behaviour and training issues; altered behavior, 
                                distress, aggression, fears
                            </li>
                            <li>
                                Family transition, abandonment, additional pets, 
                                babies, other family members Environmental change, 
                                travel, emigration
                            </li>
                            <li>
                                Health, illness, disease (healing is always in 
                                conjunction with veterinary care)
                            </li>
                        </ul>
                        <p className="main__section__p main__section__p--last">
                            The best by-product of practising this communication 
                            work is when guardians develop their own skills. 
                            Through shared knowledge and mutual understanding, 
                            we move from concern, depression or grief to balance 
                            and well-being, even harmony.
                        </p>
                    </section>
                </div>
            </main>
            <Nav page="communication" />
        </>
    )
}

export default Communication;