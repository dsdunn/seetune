import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser } from '../apiCalls';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';

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
      <div>
        <h1>SeeTune</h1>
        { !this.state.accesstoken && <Login/> }
        {this.state.user && <User user={this.state.user} />}
      </div>
    );
  }
}

export default App;
