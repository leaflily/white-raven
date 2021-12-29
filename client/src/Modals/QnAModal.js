import React from 'react';
import Submit from '../Controllers/Submit';
import Search from '../Controllers/Search';
import QnA from '../Components/QnA';
import validateEmail from '../utils/validateEmail';
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
        a: 'After booking, you will receive a confirmation email. I will be in touch with the next available dates and times, along with payment details.'
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
            email: '',
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
        this.eventFunctions.submit = this.eventFunctions.submit.bind(this);
        this.submit.cancel = this.submit.cancel.bind(this);
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
        submit: () => { 
            if (!this.state.showStatus) {
                const {email} = this.state;
                if (this.state.name === '') {
                    this.setState({
                        invalid: 'name'
                    });
                }
                else if (!validateEmail(email)) {
                    this.setState({
                        invalid: 'email'
                    });
                }
                else {
                    this.submit.sendQuery();
                }
            }
        },
        finish() {
            this.matchResults = [];
            this.setState({
                query: '',
                name: '',
                email: '',
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
    
    // submit stuff
    submit = {
        getProps: () => {
            return {
                data: this.submit.getData(),
                url: this.submit.url,
                onSuccess: this.submit.success,
                cancel: this.submit.cancel,
                captcha: this.submit.captcha,
                latch: this.submit.latch
            }
        },
        latch: false,
        try: () => {
            this.setState({
                showStatus: true
            });
        },
        cancel: () => {
            this.setState({
                showStatus: false
            }, () => this.closeStatus());
        },
        getData: () => {
            const {query, name, email} = this.state;
            return {query, name, email}
        }, 
        sendQuery: () => {
            this.submit.captcha = true;
            this.submit.url = '/server/query';
            this.submit.latch = false;
            this.submit.success = () => {
                this.setState({
                    querySent: true,
                    showStatus: false
                });
            };
            this.submit.success = this.submit.success.bind(this);
            this.submit.try();
        }
    }
    closeStatus() {
        this.setState({
            showStatus: false
        })
    }
    
    queryCompleteMessage() {
        return (
            <div className="modal__qna__complete">
                <div className="modal__qna__complete__header">
                    <h2>Query Sent!</h2>
                </div>
                <QnA q={this.state.query}
                    a={<>Thank you {this.state.name} for asking.<br /> 
                    I really do appreicate your interest.<br />
                    I'll get back to you with an answer soon.<br />
                    You should receive a email confirming I've 
                    received your query<br />(P.S. if you can't find 
                    the confirmation email please double check {this.state.email} is 
                    the correct address and check your email's junk folder)</>} 
                />
            </div>
        )
    };
    render() {
        return (
            <>
                {this.state.showStatus && <Submit {...this.submit.getProps()} /> }
                { this.state.querySent ? this.queryCompleteMessage() :
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
                                    <Input invalid={this.state.invalid} dataName="email" aria-label="Email address" value={this.state.email} onChange={this.handleEvent} data-dest="QnAModal" data-func="input" data-params="email,value" className="modal__qna__email" type="email" placeholder="Email address" name="email" />
                                </div>
                                <input aria-labelledby="askQuery" onClick={this.handleEvent} data-dest="QnAModal" data-func="submit" className="modal__qna__ask" type="submit" value="Ask" />
                            </div>
                            </>
                            }
                        </div>
                    </form>
                }
            </>
        )
    }
}

export default QnAModal;

