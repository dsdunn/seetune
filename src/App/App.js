import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser, getTopTracks } from '../apiCalls';
import { tracksByGenre } from '../utilities';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';

class App extends Component {
  state = {
    token: ''
  }

  componentDidMount() {
    let token = window.location.href.split('=')[1] || '';

    if (token){
      this.setUser(token);
    }
  }

  componentDidUpdate () {

  }

  async setUser (token) {
    let user = await getUser(token);

    this.setState({token, user})
    this.getTopTracks(token);
  }

  async getTopTracks (token) {
    let topTracks = await getTopTracks(token);
    let tracks = await tracksByGenre(topTracks);

    this.setState({ 
      tracks
    });

    // let topArtists = awain getTopArtists(token);
  }

  render() {
    return (
      <div>
        <h1>SeeTune</h1>
        { !this.state.token && <Login/> }
        {this.state.user && <User user={this.state.user} />}
      </div>
    );
  }
}

export default App;
