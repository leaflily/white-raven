import React from 'react';
import Status from './Status';
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
            name: '',
            email: '',
            emailInvalid: false,
            displayAnswers: [],
            showMore: 1,
            showNResults: 4,
            querySent: false,
            showStatus: false,
            statusProps: {
                classNames: '',
                msg: '',
                alt: {
                    name: null,
                    handler: null
                },
                cancel: this.eventFunctions.cancelSubmit
            }
        }
        this.handleEvent = this.handleEvent.bind(this);
        this.matchResults = [];
        this.submitInProgress = false;
        this.updateStatus = this.updateStatus.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
        this.eventFunctions.submit = this.eventFunctions.submit.bind(this);
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
            this.searchAnswers().then(matches => {
                matchResults = matches;
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
        submit: () => { 
            if (!this.submitInProgress) {
                const {query, name, email} = this.state;
                if (!email.match(/\w+@\D+\.\w+/)) {
                    this.requireEmail();
                    this.submitInProgress = false;
                    return
                }
                else {
                    this.submitInProgress = true;
                    this.updateStatus('Sending your query');
                    this.setState({
                        emailInvalid: false
                    })
                }
                const data = JSON.stringify({query, name, email});
                const xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/server/emailquery.php", true);
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        this.closeStatus();
                        this.setState({
                            querySent: true,
                        }, () => this.submitInProgress = false);
                    }
                    else {
                        this.updateStatus('Unable to connect', false, {name: 'Retry', handler: this.eventFunctions.retrySubmit});
                    }
                };
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(data);
            }
        },
        retrySubmit: () => {
            this.submitInProgress = false;
            this.eventFunctions.submit();
        },
        cancelSubmit: () => {
            this.submitInProgress = false;
            this.closeStatus();
        },
        exit() {
            this.matchResults = [];
            this.setState({
                query: '',
                name: '',
                email: '',
                emailInvalid: false,
                displayAnswers: [],
                showMore: 1,
                showNResults: 4,
                querySent: false
            });
            this.updateAnswers();
        }
    };
    updateStatus(msg, spin, alt = this.state.statusProps.alt, cancel = this.state.statusProps.cancel) {
        const classNames = spin ? '' : 'no-spin';
        this.setState({
            showStatus: true,
            statusProps: {
                classNames,
                msg: msg,
                alt: alt,
                cancel: cancel
            }
        })
    }
    closeStatus() {
        this.setState({
            showStatus: false
        })
    }
    handleEvent(e) {
        e.preventDefault();
        const target = e.target.hasAttribute('data-func2') ? e.target : e.target.parentElement;
        const func = target.getAttribute('data-func2');
        let params = target.hasAttribute('data-params') ? target.getAttribute("data-params").replace(/\s\s+/g, '').split(',') : [];
        if (params.includes('value')) { 
            params.splice(params.indexOf('value'), 1, target.value);
        }
        func && this.eventFunctions[func].apply(this, params);
    }
    preventDefault(e) {
        e.preventDefault();
    }
    queryCompleteMessage() {
        return (
            <div className="modal__qna__complete">
                <div className="modal__qna__complete__header">
                    <h2>Query Sent!</h2>
                    <div className="modal__qna__complete__exit" onClick={this.handleEvent} data-func2="exit">X</div>
                </div>
                <QnA q={this.state.query}
                    a={<>Thank you {this.state.name} for asking.<br /> 
                    I really do appreicate your interest.<br />
                    I'll get back to you with an answer soon.<br />
                    You should receive a email confirming I've 
                    received your query<br />(P.S. if you can't find 
                    the confirmation email please double check 
                    {this.state.email} is the correct address and 
                    check your email's junk folder)</>} 
                />
            </div>
        )
    };
    requireEmail() {
        this.setState({
            emailInvalid: true
        })
    }
    render() {
        return (
            <div className="modal modal--qna" onClick={this.props.handleEvent} data-func="closeModal">
                {this.state.showStatus && <Status {...this.state.statusProps} /> }
                <div className="modal__box">
                <div className="modal__box__exit" onClick={this.props.handleEvent} data-func="closeModal">X</div>   
                    <div className="modal__box__content modal__qna">
                        <h1 className="modal__qna__title">Q & A</h1>
                        { this.state.querySent ? this.queryCompleteMessage() :
                            <form onSubmit={this.preventDefault} className="modal__qna__form" autoComplete="on">
                                <textarea value={this.state.query} onChange={this.handleEvent} data-func2="input" data-params="query,value" className="modal__qna__query" type="text" placeholder="Describe your query" />
                                <div onScroll={this.handleScroll} className="modal__qna__answers">
                                    {this.state.displayAnswers.map(a => <QnA key={QnAs[a].q} q={QnAs[a].q} a={QnAs[a].a} />)}
                                    {this.state.query !== '' && this.matchResults.length <= this.state.displayAnswers.length && <>
                                    <div className="modal__qna__answers__dialog">
                                        <h3>Query unanswered?</h3>
                                        <p className="modal__qna__answers__dialog__q">{this.state.query}</p>
                                        <div className="modal__qna__answers__dialog__a">
                                            <input value={this.state.name} onChange={this.handleEvent} data-func2="input" data-params="name,value" className="modal__qna__name" type="text" placeholder="Name"  autoComplete="name" />
                                            <input value={this.state.email} onChange={this.handleEvent} data-func2="input" data-params="email,value" className={'modal__qna__email '+(this.state.emailInvalid ? 'required' : '')} type="email" placeholder="Email Address" autoComplete="email" />
                                        </div>
                                        <input onClick={this.handleEvent} data-func2="submit" className="modal__qna__ask" type="submit" value="Ask" />
                                    </div>
                                    </>
                                    }
                                </div>
                            </form>
                        }
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