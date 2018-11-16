import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    response: ''
  }

  componentDidMount() {
    // this.callApi()
    // console.log('mount')
  }

  handleLogin = async () => {
    window.location = 'http://localhost:8888/login';
  }

  //make auth call, redirect to spotify auth, user clicks ok, spotaut redirects to /callback which displays info.

  render() {
    return (
      <div className="App">
      hellooooo?
        <p onClick={this.handleLogin}>login</p>
      </div>
    );
  }
}

export default App;
