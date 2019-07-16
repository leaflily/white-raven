import React from 'react';
import Header from './Header';
import Nav from './Nav';
import Image from './Image';
import './main.css';
import './About.css';

function About() {
    const quote = {
        text: 'People who know me say simply, ‘Denise is an animal person’',
        author: 'Denise Law'
    }
    return (
        <>
            <Header page="about" quote={quote} />
            <main className="main main--about">
                <div className="main__section-background main__section-background--blue">
                    <section className="main__section">
                        <figure className="main__section__figure--Chimp image">
                            <Image fileName="chimp.jpg" sizeShifts={[0, 600]} className="" alt="Denise hugging chimp" />
                        </figure>
                        <h1 className="main__section__headline">About Me</h1>
                        <p>
                            Having a lifelong interest in animals, I have been 
                            the guardian and carer for a great variety of them - 
                            from the humble gerbil, goats, dogs, donkeys to the 
                            more unusual - meerkats, chinchillas, parrots, 
                            reptiles to name but a few, also endangered species 
                            such as monkeys from South America and potoroos from 
                            Australia. I am widely travelled and have many 
                            wildlife experiences on which to draw.
                        </p>
                        <p>
                            Ever passionate about the idea of communicating with 
                            animals, I developed and refined my early ‘Dr. Doolittle’ 
                            instincts into a formally accredited skill when my 
                            human family members had left the nest. For me, the 
                            catalyst to the process of serious study was discovering 
                            the remarkable Anna Breytenbach and her transformative 
                            work with a black leopard, Spirit, at Jukani Predator 
                            Park, a game rescue centre, in South Africa in 2012.
                        </p>
                    </section>
                </div>
                <div className="main__section-background main__section-background--orange">
                    <section className="main__section">
                            <p>
                                Thus inspired, I trained with renowned experts and mentors, 
                                Nancy Windheart, Amelia Kinkade, Danielle Tremblay, studied 
                                at the internationally recognized Animal Talk Africa Online 
                                Academy, and qualified as a certified advanced practitioner 
                                in animal communication in 2018.
                            </p>
                            <iframe className="main__section__iframe--youtube pre-img" title="Youtube: The incredible story of how leopard Diabolo became Spirit - Anna Breytenbach, 'animal communicator'." 
                                src="https://www.youtube-nocookie.com/embed/gvwHHMEDdT0" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                            <p className="main__section__bottom-p">
                                Like my mentors, my main aim is to increase our awareness of 
                                and compassion for animals, and by communicating with them 
                                to acquire a deeper understanding and relationship with 
                                all life.
                            </p>
                            <div className="main__section__bottom-clearance"></div>
                    </section>
                </div>
            </main>
            <Nav page="about" />
        </>
    );
}

export default About;