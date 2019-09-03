import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ScrollToTop from './Controllers/ScrollToTop';
import Landing from './Views/Landing';
import Communication from './Views/Communication';
import About from './Views/About';
import Reviews from './Views/Reviews';
import Consultation from './Views/Consultation';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appClass: 'App'
    }
    this.a11yRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => this.setState({
      appClass: 'App App-loaded'
    }), 500);
    (function preloadThumbs() {
      var folders = [
        { name: 'small', 
          thumbs: [
            'andy.jpg', 'beth.jpg', 'carolle.jpg', 'chimp.jpg', 'dolphin.jpg', 
            'elephants.jpg', 'jenni.jpg', 'mia.jpg', 'rowan.jpg', 'samantha.jpg', 
            'tracey.jpg'
        ]}, 
        { name: 'medium', 
          thumbs: [
            'chimp.jpg', 'dolphin.jpg', 'elephants.jpg'
        ]},
        { name: 'large', 
          thumbs: [
            'dolphin.jpg', 'elephants.jpg'
        ]},
        { name: 'xlarge', 
          thumbs: [
            'dolphin.jpg', 'elephants.jpg'
        ]}
      ];
      for (let folder of folders) {
        for (let thumb of folder.thumbs) {
          if (!localStorage.getItem(`thumb${folder.name}${thumb}`)) {
            import(`./images/${folder.name}/thumbs/${thumb}`).then(img => localStorage.setItem(`thumb${folder.name}${thumb}`, img.default))
          }
        }
      }
    }())
  }
  pages = {
    Landing,
    Communication,
    About,
    Reviews,
    Consultation
  }
  render() {
    return (
      <div className={this.state.appClass}>
        <Router>
        <ScrollToTop>
          <Route render={({ location }) => (<>  
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                timeout={800}
                classNames='page-fade'
              >
              <div>
                <Switch location={location}>
                      <Route path="/" exact component={Landing} />
                      <Route path="/communication" component={Communication} />
                      <Route path="/about" component={About} />
                      <Route path="/reviews" component={Reviews} />
                      <Route path="/consultation" component={Consultation} />
                </Switch>
              </div>
              </CSSTransition>
            </TransitionGroup>
          </>)}/>
          </ScrollToTop>
        </Router>
      </div>
    )
  }
}

export default App;

