import React from 'react';
import Header from './Header';
import Nav from './Nav';
import './main.css';
import './Reviews.css';

const reviewsData = [
    /*
    {
        name: '',
        img: '',
        alt: '',
        text: ``
    },
    */
    {
        name: 'Rowan and Wilma',
        img: '',
        alt: 'Cat on top of cupboard',
        text: `"I was excited to think that Denise would be chatting to my feline friend Wilma. I was intrigued and hopeful to imagine that my relationship with Wilma could improve. As with any relationship, i know how much happier i am when i feel i better understand another soul. I was delighted with what i learned about my feline friend and the things she chose to share with Denise. My world was forever changed as i now see Wilma with different eyes. It's made me look at my own habits and change some of my own behaviours towards Wilma and this greater respect has shifted the energy exchange between us. This is a magical and beautiful thing to witness. 
I found Denise to have a huge warm heart full of compassion and I was very impressed with the accuracy of her intuitive skills and gentle approach to the way she worked throughout the process. Our discussions both before and after the communication with Wilma, felt easy and comfortable. 
Thank you Denise. 

With love and gratitude from Wilma and I."`
    },
    {
        name: 'Beth and Bella',
        img: '',
        alt: 'Dog and horse touching snouts',
        text: `“I have known Denise for a number of years. She is such an beautiful lady, so spiritual and calm 

I have been honoured to have Denise communicate with my fur baby and soul mate Bella. Over the years Bella has been through so much and Denise has guided me through very emotional times and has provided support when Bella has had to undergo surgery and when sometimes we needed that little bit extra. 
        
Compassionate, understanding and truly amazing “`
    },
    {
        name: 'Carolle, Sara, Charlot and Jordan',
        img: '',
        alt: 'Three cats sleeping',
        text: `"I met Denise through a friend and she connected with my 3 cats, at different times.  That was a first for me and what an enriching experience that was!  She told me things that only my cats knew and she completely felt their personalities. She made me understand some of their behaviors, so I knew how I could help them.  I have learned from her connections that my cats understand more than I thought they did and I have started to speak with them now.  Through her I was able to feel the link between the cats and myself.  The whole experience was very positive for all!"`
    },
    {
        name: 'Jenni and Sasha',
        img: '',
        alt: 'Portrait of Dog',
        text: `"I found Denise to be naturally honest and professional in her approach to her work. Denise worked with a few of my animals, including my German Shepherd Sasha. We had no specific issue to deal with in this instance, although I did have some very specific questions. The outcome was a lovely clarity and deepening in relationships all around. Denise was able to identify, in her own way, Sasha’s unique relationship with her human family and animal family, including one of our past animals now in spirit. Some of the communication revealed simply startled me, in a good way! Denise approached all of the communications with openness and receptivity, which made way for clear and compassionate communication. To work with Denise as an animal communicator is an overall insightful and very enjoyable experience."`
    }
]

function Review(props) {
    const review = bgColour => { 
        return ( 
            <div className={'main__section-background main__section-background--'+bgColour}>
                <section className="main__section main__section--blue">
                    <div className="main__section__name-and-photo">
                        <img className="pre-img" src={props.img} alt={props.alt} />
                        <h4>{props.name}</h4>
                    </div>
                    <div className="main__section__text">
                        <p>{props.text}</p>
                    </div>
                </section>
            </div>
    )};
    return review(props.odd ? 'blue' : 'orange')
}

function Reviews() {
    const quote = {
        text: <q>Clearly, animals know more than we think, and think a great deal more than we know.</q>,
        author: 'Irene M. Pepperberg'
    }
    const reviews = reviewsData.map((review, i) => <Review key={review.name} odd={i%2===0} {...review} />);
    return (
        <>
            <Header page="reviews" quote={quote} />
            <main className="main main--reviews">
                {reviews}
            </main>
            <Nav page="reviews" />
        </>
    )
}

export default Reviews;