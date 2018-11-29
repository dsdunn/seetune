import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser, getTopTracks, getAudioFeatures, getGenres } from '../apiCalls';
import { tracksByGenre, asyncForEach } from '../utilities';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';

class App extends Component {
  state = {
    token: null,
    genres: null,
    user: null,
    topTracks: []
  }

  componentDidMount() {
    let token = window.location.href.split('=')[1] || '';

    if (token) {
      this.setUser(token);
    }
  }

  async setUser (token) {
    let user = await getUser(token);

    this.setState({token, user})
    this.setTopTracks(token);
  }

  async setTopTracks (token) {
    let topTracks = await getTopTracks(token);

    this.setState({ 
      topTracks
    });
    this.setTrackDetails();
  }

  async setTrackDetails () {
    let topTracks = this.state.topTracks;

    asyncForEach(topTracks, async (track) => {
      track.audioFeatures = await getAudioFeatures(this.state.token, track.id);
      track.genres = await getGenres(this.state.token, track.artistId);
    })
    this.setState({topTracks})
    setTimeout( () => this.setGenres(), 3000)
    // this.setGenres(); 
    // there MUST be a better way than waiting for the genre promises in state.topTracks.[n] to resolve like this
  }

  async setGenres () {
    let tracks = this.state.topTracks;
    let genres = tracksByGenre(tracks);

    this.setState({genres});
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
