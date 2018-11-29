import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser, getTopTracks, getAudioFeatures, getGenres } from '../apiCalls';
import { tracksByGenre, asyncForEach } from '../utilities';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';

class App extends Component {
  state = {
    loading: false,
    token: '',
    genres: {},
    user: {},
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

    this.setState({ token, user, loading: true })
    this.setTopTracks(token);
  }

  async setTopTracks (token) {
    let topTracks = await getTopTracks(token);
    topTracks = await this.setTrackDetails(topTracks);

    let interval = setInterval(() => {
      if (topTracks[topTracks.length - 1].genres) {     
        this.setState({topTracks});
        this.setGenres(topTracks);
        window.clearInterval(interval);
        this.setState({ loading: false });
      };
    }, 500)
  }

  async setTrackDetails (topTracks) {
    asyncForEach(topTracks, async (track) => {
      let audioFeatures = await getAudioFeatures(this.state.token, track.id);
      track.audioFeatures = await audioFeatures;
      let genres = await getGenres(this.state.token, track.artistId);
      track.genres = await genres;
    })
    return topTracks;
  }

  async setGenres (topTracks) {
    let genres = tracksByGenre(topTracks);

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
