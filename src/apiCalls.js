import { topTracksCleaner } from './dataCleaners'

const baseUrl = 'https://api.spotify.com/v1/';
const options = (token) => ({
    "headers": {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"    
    }
  })
const fetchData = async (url, token) => {
  let result = await fetch(url, options(token));
  return result.json();
}

export const getUser = async (token) => {
  let url = baseUrl + 'me';
  let user = await fetchData(url, token);

  return user;
}

export const getTopTracks = async (token, nextUrl) => {
  let topTracks = [];
  let url = nextUrl ? nextUrl : baseUrl + 'me/top/tracks';
  let rawTracks = await fetchData(url, token);
  let trackSet = await topTracksCleaner(rawTracks, token);
  
  topTracks = [...topTracks, ...trackSet];

  if (rawTracks.next){
    trackSet = await getTopTracks(token, rawTracks.next);
    topTracks = [...topTracks, ...trackSet];
  }
  return topTracks
}




//getGenres

//getAudioFeatures

