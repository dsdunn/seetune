import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser } from '../apiCalls';
import './App.css';

import Login from '../Login/Login'

class App extends Component {
  state = {
    accesstoken: ''
  }

  async componentDidMount() {

    let accesstoken = window.location.href.split('=')[1] || '';
    let user = await getUser(accesstoken);

    this.setState({ accesstoken, user });
  }

  render() {
    return (
      !this.state.accesstoken && <Login/>  
    );
  }
}

export default App;
