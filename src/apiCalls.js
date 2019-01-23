import  { fetchData } from './fetch'
import { topTracksCleaner } from './utilities'

const baseUrl = 'https://api.spotify.com/v1/';

export const getUser = async (token) => {
  let url = baseUrl + 'me';
  let user = await fetchData(url, token);

  return user;
}

export const getTopTracks = async (token, range='short_term', nextUrl) => {
  let topTracks = [];
  let url = nextUrl ? nextUrl : baseUrl + 'me/top/tracks?time_range=' + range;
  let rawTracks = await fetchData(url, token);
  let trackSet = await topTracksCleaner(token, rawTracks);
  
  topTracks = [...topTracks, ...trackSet];

  if (rawTracks.next){
    trackSet = await getTopTracks(token, range, rawTracks.next);
    topTracks = [...topTracks, ...trackSet];
  }
  return topTracks
}

export const getGenres = async (token, id) => {
  let artist = await fetchData(baseUrl + 'artists/' + id, token);
  
  return artist.genres;
}


export const getAudioFeatures = async (token, id) => {
  let features = await fetchData(baseUrl + 'audio-features/' + id, token);

  return features;
}

