import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { getUser, getTopTracks, getAudioFeatures, getGenres, refreshAuth } from '../apiCalls';
import { tracksByGenre, asyncForEach } from '../utilities';
import '../reset.css';
import './App.css';

import Login from '../Login/Login';
import User from '../User/User';
import TempoGraph from '../Visualizations/TempoGraph';
import ScatterPlot from '../Visualizations/ScatterPlot';

class App extends Component {
  state = {
    loading: false,
    token: '',
    genres: {},
    user: {},
    topTracks: [],
    range: 'short_term'
  }

  async componentDidMount() {
    let token = window.location.href.split('=')[1] || '';
    let refresh_token = window.location.href.split('=')[2] || '';

    if (token) {
      this.setUser(token);
      this.setState({
        token,
        refresh_token,
        loading: true
      })

      window.setInterval(async () => {
        let response = await refreshAuth(this.state.refresh_token);
        let result = await response.json();
        let token = result.access_token;
        let refresh_token = result.refresh_token;

        this.setState({
          token,
          refresh_token
        })
      }, 30 * 60000)
    }
  }

  async setUser (token) {
    let user = await getUser(token);

    this.setState({ user })
    this.setTopTracks(token);
  }

  async setTopTracks (token, range=this.state.range) {
    try {
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
    } catch(error) {
      console.error(error);
      let response = await refreshAuth(this.state.refresh_token);
      let result = response.json();
      let { token, refresh_token } = result;
        this.setState({
          token,
          refresh_token
        })
      this.setUser(token);
    }
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

  signOut = () => {
    this.setState({
      token: '',
      user: {}
    })
  }

  render() {
    return (
      <div className='app-body'>
        <header>
          <h1 className='title'>SeeTune</h1>
          <p className='subtitle'>Interactive graphs for Spotify users to visualize and compare charactaristics of their top tracks.</p>
        </header>
        <div className='app'>
          {this.state.user && <User user={this.state.user} signOut={this.signOut} />}
          {!this.state.token && <Login/>}
          { this.state.token && 
            <section className='visualizations'>
              <Router>
                <div>
                  <nav>  
                    <NavLink className='nav-link' to={`/bar`}>Bar Chart</NavLink>
                    <form className='range-form'>
                      <label htmlFor='range'>Time Range: </label>
                      <select 
                        name='range'
                        value={ this.state.range } 
                        onChange={ this.handleRangeChange }>
                        <option value='short_term'>Short (~1 month)</option>
                        <option value='medium_term'>Meduim (~6 months)</option>
                        <option value='long_term'>Long (years)</option>
                      </select>
                    </form>
                    <NavLink className='nav-link' to={`/scatter`}>Scatter Plot</NavLink>
                  </nav>
                  <Route path='/bar' render={ (props) => (
                      <TempoGraph 
                        {...props}
                        topTracks={ this.state.topTracks.length > 59 && this.state.topTracks[59].tempo && this.state.topTracks } 
                        range={ this.state.range }
                        loading= { this.state.loading }/>
                  )}/>
                  <Route path='/scatter' render={ (props) => (
                      <ScatterPlot
                        {...props}
                        topTracks={ this.state.topTracks.length > 59 && this.state.topTracks[59].tempo && this.state.topTracks }
                        loading= { this.state.loading }/>
                  )}/>
                </div>
              </Router>
            </section>
          }
        </div>
        <footer>
          <p>Built with D3.js and powered by the Spotify API</p>
          <p>&copy; dsdunn 2019</p>
        </footer>
      </div>
    );
  }
}

export default App;
