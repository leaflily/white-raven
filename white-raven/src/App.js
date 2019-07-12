import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './Views/Header';
import Nav from './Views/Nav';
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
      page: 'Landing'
    }
  }
  render() {
    const page = this.state.page.toLowerCase();
    return (
      <div className="App">
        <Router>
          <Route path="/" exact component={Landing} />
          <Route path="/communication" component={Communication} />
          <Route path="/about" component={About} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/consultation" component={Consultation} />
        </Router>
      </div>
    )
  }
}

export default App;

