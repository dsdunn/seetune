import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getUser, getTopTracks, getAudioFeatures, getGenres } from '../apiCalls';
import { tracksByGenre, asyncForEach } from '../utilities';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';
import TempoGraph from '../Visualizations/TempoGraph';

class App extends Component {
  state = {
    loading: false,
    token: '',
    genres: {},
    user: {},
    topTracks: [],
    range: 'short_term'
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

  async setTopTracks (token, range=this.state.range) {
    let topTracks = await getTopTracks(token, range);
    topTracks = await this.setTrackDetails(topTracks);

    let interval = setInterval(() => {
      if (topTracks[topTracks.length - 1].genres) {     
        this.setState({topTracks});
        // this.setGenres(topTracks);
        window.clearInterval(interval);
        this.setState({ loading: false });
      };
    }, 500)
  }

  async setTrackDetails (topTracks) {
    asyncForEach(topTracks, async (track) => {
      let audioFeatures = await getAudioFeatures(this.state.token, track.id);

      Object.assign(track, await audioFeatures);
      let genres = await getGenres(this.state.token, track.artistId);

      track.genres = await genres;
    })
    return topTracks;
  }

  async setGenres (topTracks) {
    let genres = tracksByGenre(topTracks);

    this.setState({genres});
  }

  handleRangeChange = (event) => {
    let range = event.target.value;

    this.setState({ 
      range,
      loading: true 
    });
    this.setTopTracks(this.state.token, range)
  }

  render() {
    return (
      <div>
        { !this.state.token && <Login/> }
        {this.state.user && <User user={this.state.user} />}
        <h1 className='title'>SeeTune</h1>
        <p className='subtitle'>Graphs to visualize your listening habits and preferences.</p>
        <form>
          <select 
            name="range" 
            value={ this.state.range } 
            onChange={ this.handleRangeChange }>
            <option value='short_term'>Short</option>
            <option value='medium_term'>Meduim</option>
            <option value='long_term'>Long</option>
          </select>
        </form>

        <section className='visualizations'>
          <TempoGraph 
            topTracks={ this.state.topTracks.length > 49 && this.state.topTracks } 
            range={ this.state.range }
            loading= { this.state.loading }/>
        </section>
      </div>
    );
  }
}

export default App;
