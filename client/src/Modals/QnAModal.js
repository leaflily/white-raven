import React from 'react';
import Search from '../Controllers/Search';
import QnA from '../Components/QnA';
import Input from '../Components/Input';
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
        a: 'After booking I will be in touch with the next available dates and times, along with payment details.'
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
        tags: 'price, time, included, pay, payment',
        q: 'How much will it cost and what will that include?',
        a: `Each communication is £85 per animal this includes a distant communication (45mins) plus a skype/phone call. 
        
Distant Animal Reiki Session 1 x 30 mins - £30 or 3 x 30 mins - £80, to be used within 3 months.`
    },
    {
        tags: 'multiple',
        q: 'Can I book in for more then one animal?',
        a: 'Each consultation will focus on just one animal at a time. To make a booking for more then one animal please go through the booking process for each animal in turn.'
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
    'can',
    'make'
]

class QnAModal extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            query: '',
            name: '',
            displayAnswers: [],
            showMore: 1,
            showNResults: QnAs.length,
            querySent: false,
            showStatus: false,
            invalid: ''
        }
        this.handleEvent = this.handleEvent.bind(this);
        this.matchResults = [];
        this.closeStatus = this.closeStatus.bind(this);
    }
    componentDidMount() {
        document.title = 'Q&A - White Raven';
        this.updateAnswers();
        
    }
    eventFunctions = {
        input(name, value) {
            this.setState({
                [name]: value,
                invalid: ''
            }, () => {
                if (name === 'query') {
                    this.updateAnswers();
                }
            });
        },
        finish() {
            this.matchResults = [];
            this.setState({
                query: '',
                name: '',
                invalid: '',
                displayAnswers: [],
                showMore: 1,
                showNResults: QnAs.length,
                querySent: false
            });
            this.updateAnswers();
        }
    };
    handleEvent(e) {
        const target = e.target.hasAttribute('data-dest') ? e.target : e.target.parentElement;
        if (target.getAttribute('data-dest') === 'QnAModal') {
            e.preventDefault();
            const func = target.getAttribute('data-func');
            let params = target.hasAttribute('data-params') ? target.getAttribute("data-params").replace(/\s\s+/g, '').split(',') : [];
            if (params.includes('value')) { 
                params.splice(params.indexOf('value'), 1, target.value);
            }
            func && this.eventFunctions[func].apply(this, params);
        }
    }
    preventDefault(e) {
        e.preventDefault();
    }

    //search stuff 
    searchAnswers () {
        return Search({query: this.state.query, data: QnAs, exclude: excludeSearchWords});
    }
    updateAnswers() {
        var displayAnswers = [];
        var matchResults = [];
        
        const updateIndexes = () => {
            const matches = matchResults.length > this.matchResults.length ? matchResults : this.matchResults;
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
            this.matchResults = matchResults;
            for (let i=0;i<showNResults();i++) {
                displayAnswers.push(matchResults.length > 0 ? matches[i] : i);
            }
            this.setState({displayAnswers});
        }
        if (this.state.query !== '') {
            matchResults = this.searchAnswers();
            updateIndexes();
        }
        else {
            updateIndexes();
        }
        
    }

    closeStatus() {
        this.setState({
            showStatus: false
        })
    }
    
    render() {
        return (
            <>
                <form onSubmit={this.preventDefault} className="modal__qna__form" autoComplete="on">
                    <textarea id="askQuery" value={this.state.query} onChange={this.handleEvent} data-dest="QnAModal" data-func="input" data-params="query,value" className="modal__qna__query" type="text" placeholder="Describe your query" aria-label="Describe your query." />
                    <div onScroll={this.handleScroll} className="modal__qna__answers">
                        {this.state.displayAnswers.map(a => <QnA key={QnAs[a].q} q={QnAs[a].q} a={QnAs[a].a} />)}
                        {this.state.query !== '' && this.matchResults.length <= this.state.displayAnswers.length && <>
                        <div className="modal__qna__answers__dialog">
                            <h3>Query unanswered?</h3>
                            <p className="modal__qna__answers__dialog__q">{this.state.query}</p>
                            <div className="modal__qna__answers__dialog__a">
                                <Input invalid={this.state.invalid} dataName="name" aria-label="Your name" value={this.state.name} onChange={this.handleEvent} data-dest="QnAModal" data-func="input" data-params="name,value" className="modal__qna__name" type="text" placeholder="Your name" name="name" />
                            </div>
                            <a className="modal__message__send" href={`mailto:white3raven@gmail.com?subject=${encodeURIComponent(`White Raven Q&A - ${this.state.name} asks...`)}&body=${encodeURIComponent(this.state.query)}`} title="Opens your email application">
                                Email your query
                            </a>
                        </div>
                        </>
                        }
                    </div>
                </form>
            </>
        )
    }
}

export default QnAModal;

