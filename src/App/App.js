import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Login from '../Login/Login'

class App extends Component {
  state = {
    accesstoken: ''
  }

  componentDidMount() {
    console.log('mount', window.location.href)
  }



  render() {
    return (
      <Route path="/" component={Login} />
    );
  }
}

export default App;
