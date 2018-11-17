import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    response: ''
  }

  componentDidMount() {
  }

  handleLogin = async () => {
    window.location = 'http://localhost:8888/login';
  }

  render() {
    return (
      <div className="App">
      hellooooo?
        <button onClick={this.handleLogin}>login</button>
      </div>
    );
  }
}

export default App;
