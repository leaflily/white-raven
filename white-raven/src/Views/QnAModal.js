import React from 'react';
import './modal.css';
import './QnAModal.css';

const QnAs = [
    {
        tags: '',
        q: 'Do you work with all animals?',
        a: 'At this time I am not working with missing animals.'
    },
    {
        tags: '',
        q: 'What happens after I book a session?',
        a: 'After booking, you will receive a confirmation email. I will be in touch, time can then be arranged for our Skype or phone call where we can discuss the communication in detail.'
    },
    {
        tags: 'far, location',
        q: 'Is distance an issue?',
        a: 'A communication session can be done over any distance as it is a telepathic/energetic experience.'
    },
    {
        tags: '',
        q: 'What do you need to communicate?',
        a: 'You will be asked to send a photo of your animal along with some information.'
    },
    {
        tags: 'price, time, included',
        q: 'How much will it cost and what will that include?',
        a: 'Each communication is £50 per animal this includes a distant communication (45mins) plus a skype/phone call.'
    }
];

const excludeSearchWords = [
    'the',
    'they',
    'there',
    'they\'re',
    'their',
    'them',
    'in',
    'to',
    'do',
    'on',
    'with',
    'you',
    'i',
    'is',
    'me',
    'how',
    'will',
    'what',
    'can'
]

function QnA(props) {
    return (
        <div className="modal__qna__answers__dialog">
            <p className="modal__qna__answers__dialog__q">{props.q}</p>
            <p className="modal__qna__answers__dialog__a">{props.a}</p>
        </div>
    )
}

class QnAModal extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            query: '',
            matchResults: [],
            displayAnswers: [],
            showMore: 1,
            showNResults: 4
        }
        this.handleEvent = this.handleEvent.bind(this);
    }
    searchAnswers () {
        return new Promise((resolve) => {
            const queries = this.state.query.split(' ');
            let matches = QnAs.map(tqa =>
                queries.filter(query => {
                    const q = escapeRegexMods(query);
                    return tqa.tags.match(new RegExp(q, 'i')) || 
                    tqa.q.match(new RegExp(q, 'i')) || 
                    tqa.a.match(new RegExp(q, 'i'))
                }
            ));
            matches = matches.map((m, i) => {
                return {
                    index: i,
                    score: [0, ...m.filter(w => !excludeSearchWords.includes(w.toLowerCase()))].reduce((t, w) => t + (w.length*(w.length+1)/2))
                }
            }).filter(m => m.score > 0).sort((a, b) => b.score - a.score).map(m => m.index);
            resolve(matches);
        })
    }
    updateAnswers() {
        var displayAnswers = [];
        var matchResults = [];
        
        const updateIndexes = () => {
            const matches = matchResults.length > this.state.matchResults.length ? matchResults : this.state.matchResults;
            const showNResults = () => {
                var n;
                const fullSize = this.state.showNResults * this.state.showMore;
                function removeExcess(poolSize) {
                    const difference = poolSize - fullSize;
                    return difference > 0 ? fullSize : poolSize; 
                }
                if (this.state.query === '') { 
                    /* use whole QnAs */ 
                    n = removeExcess(QnAs.length);
                }
                else if (matches.length === 0) {
                    n = 0;
                }
                else { 
                    /* use matchResults */
                    n = removeExcess(matches.length);
                }
                return n
            }
            for (let i=0;i<showNResults();i++) {
                displayAnswers.push(matchResults.length > 0 ? matches[i] : i);
            }
            this.setState({displayAnswers, matchResults});
        }
        if (this.state.query !== '') {
            console.log(this.state.query)
            this.searchAnswers().then(matches => {
                matchResults = matches;
                console.log(matches)
                updateIndexes();
            })
        }
        else {
            updateIndexes();
        }
        
    }
    componentDidMount() {
        this.updateAnswers();
        
    }
    eventFunctions = {
        input(name, value) {
            this.setState({
                [name]: value
            }, () => {
                if (name === 'query') {
                    this.updateAnswers();
                }
            });
        },
        submit() {
            
        }
    };
    handleEvent(e) {
        e.preventDefault();
        const target = e.target.hasAttribute('data-func') ? e.target : e.target.parentElement;
        const func = target.getAttribute('data-func');
        let params = target.hasAttribute('data-params') ? target.getAttribute("data-params").replace(/\s\s+/g, '').split(',') : [];
        if (params.includes('value')) { 
            params.splice(params.indexOf('value'), 1, target.value);
        }
        func && this.eventFunctions[func].apply(this, params);
    }
    preventDefault(e) {
        e.preventDefault();
    }
    render() {
        return (
            <div className="modal modal--qna" onClick={this.props.handleEvent} data-func="closeModal">
                <div className="modal__box">
                <div className="modal__box__exit" onClick={this.props.handleEvent} data-func="closeModal">X</div>   
                    <div className="modal__box__content modal__qna">
                         <h1 className="modal__qna__title">Q & A</h1>
                        <form onSubmit={this.preventDefault} className="modal__qna__form">
                            <input onChange={this.handleEvent} data-func="input" data-params="query,value" className="modal__qna__query" type="text" placeholder="Describe your query" />
                            <div onScroll={this.handleScroll} className="modal__qna__answers">
                                {this.state.displayAnswers.map(a => <QnA q={QnAs[a].q} a={QnAs[a].a} />)}
                                {this.state.query !== '' && this.state.matchResults.length <= this.state.displayAnswers.length && <>
                                <div className="modal__qna__answers__dialog">
                                    <h3>Query unanswered?</h3>
                                    <p className="modal__qna__answers__dialog__q">{this.state.query}</p>
                                    <div className="modal__qna__answers__dialog__a">
                                        <input onChange={this.handleEvent} data-func="input" data-params="name,value" className="modal__qna__name" type="text" placeholder="Name" />
                                        <input onChange={this.handleEvent} data-func="input" data-params="email,value" className="modal__qna__email" type="text" placeholder="Email Address" />
                                    </div>
                                    <input onClick={this.handleEvent} data-func="submit" className="modal__qna__ask" type="submit" value="Ask" />
                                </div>
                                </>
                                }
                            </div>
                        </form>
                    </div>
                </div> 
            </div>
        )
    }
}

export default QnAModal;

function escapeRegexMods(str) {
    const specialChars = ['+', '*', '?', '{', '}', '$', '(', ')', '[', ']', '^', '.'];
    var output = str;
    for (let char of specialChars) {
        output = output.replace(char, `\\${char}`);
    }
    return output
}