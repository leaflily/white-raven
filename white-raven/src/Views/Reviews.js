import React from 'react';
import Header from '../Components/Header';
import Nav from '../Components/Nav';
import Image from '../Components/Image';
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
        img: 'rowan.jpg',
        alt: 'A black cat, high up on the top of a cupboard.',
        text: `"I was excited to think that Denise would be chatting to my feline friend Wilma. I was intrigued and hopeful to imagine that my relationship with Wilma could improve. As with any relationship, i know how much happier i am when i feel i better understand another soul. I was delighted with what i learned about my feline friend and the things she chose to share with Denise. My world was forever changed as i now see Wilma with different eyes. It's made me look at my own habits and change some of my own behaviours towards Wilma and this greater respect has shifted the energy exchange between us. This is a magical and beautiful thing to witness. I found Denise to have a huge warm heart full of compassion and I was very impressed with the accuracy of her intuitive skills and gentle approach to the way she worked throughout the process. Our discussions both before and after the communication with Wilma, felt easy and comfortable. 

Thank you Denise. 

With love and gratitude from Wilma and I."`
    },
    {
        name: 'Beth and Bella',
        img: 'beth.jpg',
        alt: 'A dog and horse touching snouts, in a grassy field.',
        text: `I have known Denise for a number of years. She is such an beautiful lady, so spiritual and calm 

I have been honoured to have Denise communicate with my fur baby and soul mate Bella. Over the years Bella has been through so much and Denise has guided me through very emotional times and has provided support when Bella has had to undergo surgery and when sometimes we needed that little bit extra. 
        
Compassionate, understanding and truly amazing`
    },
    {
        name: 'Carolle, Sara, Charlot and Jordan',
        img: 'carolle.jpg',
        alt: 'Three cats sleeping, huddled together on settee.',
        text: `I met Denise through a friend and she connected with my 3 cats, at different times.  That was a first for me and what an enriching experience that was!  She told me things that only my cats knew and she completely felt their personalities. She made me understand some of their behaviors, so I knew how I could help them.  I have learned from her connections that my cats understand more than I thought they did and I have started to speak with them now.  Through her I was able to feel the link between the cats and myself.  The whole experience was very positive for all!`
    },
    {
        name: 'Jenni and Sasha',
        img: 'jenni.jpg',
        alt: 'A wolf type dog with slightly tilted stare, against background of blured green and browns.',
        text: `I found Denise to be naturally honest and professional in her approach to her work. Denise worked with a few of my animals, including my German Shepherd Sasha. We had no specific issue to deal with in this instance, although I did have some very specific questions. The outcome was a lovely clarity and deepening in relationships all around. Denise was able to identify, in her own way, Sasha’s unique relationship with her human family and animal family, including one of our past animals now in spirit. Some of the communication revealed simply startled me, in a good way! Denise approached all of the communications with openness and receptivity, which made way for clear and compassionate communication. To work with Denise as an animal communicator is an overall insightful and very enjoyable experience.`
    },
    //
    {
        name: 'Samantha and Scruffles',
        img: 'samantha.jpg',
        alt: 'Close up of a black and white cat\'s face.',
        text: `One of my cats Scruffles had been waking me every single night. He didn't seem to get that I was sleeping and would wake me for affection or to go out. He had become over-anxious about using his cat flap and sometimes defecating indoors was the result. He is a very quiet cat and my husband not being fully in tune with his quite indications wasn't understanding his needs if I wasn't around.

               I had had problems previously with my two cats and their relationship with one another. Denise had worked with them and the outcome was great. I don't know if it's because she had communicated with Scruffles previously and also given him Reiki healing but the communication was so clear.
               
               I had asked Denise about specific things to communicate with my cat. I had asked that he be more vocal with my husband to help my husband understand what he needed eg. food, water, love, going out. The very next day he let out loud meows and bingo my husband was responding to him! My cat also stopped waking me in the night. Denise had suggested a night time plan to my cat and he began to follow it. It's been in place for some months and he's still following it. She was able to tell me how he felt about the cat flap and it all made sense. We've had to partially remove an old wall outside leaving it more exposed to next doors cats (the enemy!) Also Denise was describing this grassy green stuff my cat wanted and how it soothed him. I realized he was communicating about a catnip and valerian mix I've given him in the past. I've made a point of getting more and it helps when he gets anxious. I was really blown away by the clarity of this communication. The way Scruffles has responded is truly magical and I think he is as grateful as I am to have shared this connection with Denise. Thank you.`
    },
    {
        name: 'Mia and Mister',
        img: 'mia.jpg',
        alt: 'A horse, head over stable door, being embraced by a young girl in bright blue jacket.',
        text: `Denise has helped me and my horse, Mister, massively. When I first got Mister in 2017 it was very difficult, After an accident, Mister ended up with kissing spine in 3 places along his back, all around the saddle area. This caused problems and he started to buck me off every time I rode him. We asked Denise if she would talk to him and this is how we gained an understanding of how this was affecting him and how he felt about the situation. 

        Not only had Denise helped me with injury-related problems with Mister but she also has helped with behavioural and general problems he experiences and why he does certain things to relieve this, such as box walking due to stress. 

        A lot of Mister's problems are from his past and everything she tells me about past conversations with Mister has been accurate. Denise picks up a lot from animals and tries to understand what they have to say, which releases the emotional side of their life which they can’t talk about but it affects them. Mister has regularly shown Denise pictures during their conversation,  and I thoroughly appreciate the time she takes to talk to the animals and to get an understanding of their personality and behaviour. She explains Mister to a T every time we talk about him and can tell me exact things that have been going on and how he feels.`
    },
    {
        name: 'Andy, Tracey and Mona',
        img: 'andy.jpg',
        alt: 'A wolf type dog facing back towards the camera, looking calmly of to the left.',
        text: `We have known Denise for many years and her spiritual essence has always shone through. Denise was kind enough to offer her help when we were going through a bad time with a Wolfdog we had purchased from the USA.  As a sceptical lady I was very unsure about animal communication, but thought it can't hurt to give it a try. Denise spent some time communicating with our wolfdog and would give us ideas on how to help her overcome her fears. Still not 100% sure they were actually communicating until one day Denise relayed what she had got back from our girl, with the added comment about a green dog bowl, it was at this moment that I knew that they were truly communicating, this green bowl was very significant and no one in this country would of know about it. Without Denise's help, I don't know what would of happened to our girl. This was 3 years ago, and even now we ask Denise if she would connect with our girl to check everything is ok. We owe so much to Denise, for helping where others wouldn't.`
    },
    {
        name: 'Tracey and Drake',
        img: 'tracey.jpg',
        alt: 'A Northern Inuit dog, looking happy outside in a yard.',
        text: `January 2019 we had a dog come to us who had been severely injured in a dog attack. He was just a year old and in a terrible state, both physically and mentally. We have often called upon Denise for help with our dogs, and she has always found the solution to an issue they have by communicating with them for us. 
        
        The first person I thought of contacting for Drake was Denise, he was in such a sorry state that I didn't know if I could help him on my own. 
        
        Denise was more than happy to help and spent many a day giving him reki long distance and in person. The communication between Denise and Drake was very interesting. I know that Drake would not be the boy he is today without the help from Denise, from a dog on the verge of being reactive of everything he is now after 4 months enjoying meeting other dogs in a calm and controlled manor. His outside scars are healing and now so are he's  inside ones. 
        
        I would highly recommend Denise and I very often do.`
    }
];

function Review(props) {
    const review = bgColour => { 
        return ( 
            <div className={'main__section-background main__section-background--'+bgColour}>
                <section className="main__section main__section--blue">
                    <div className="main__section__name-and-photo">
                        <div className="main__section__photo image">
                            <Image className="" fileName={props.img} sizeShifts={[0]} alt={'photo: '+props.alt} />
                        </div>
                        <h2 className="main__section__name">{props.name}<span className="hiddenPunctuation">.</span></h2>
                    </div>
                    <div className="main__section__text">
                        <p>{props.text}</p>
                    </div>
                </section>
            </div>
    )};
    return review(props.odd ? 'blue' : 'orange')
}

class Reviews extends React.Component {
    constructor(props) {
        super(props);
        this.start = React.createRef(null);
    }
    quote = {
        text: <q>Clearly, animals know more than we think, and think a great deal more than we know.</q>,
        author: 'Irene M. Pepperberg'
    }
    componentWillMount() {
        this.reviews = reviewsData.map((review, i) => <Review key={review.name} odd={i%2===0} {...review} />);
    }
    componentDidMount() {
        document.title = 'Reviews - White Raven'; 
        this.start.current.focus();
    }
    render() {
        return (
            <div tabIndex="-1" ref={this.start}>
                <Header page="reviews" quote={this.quote} />
                <main role="main" aria-label="reviews" className="main main--reviews">
                    {this.reviews}
                </main>
                <Nav page="reviews" />
            </div>
        )
    }
}

export default Reviews;