import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';


//components
import Homepage from './components/pages/homePage';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">


        <Route exact path='/' component={Homepage} />

      </div>
      </Router>
    );
  }
}

export default App;
