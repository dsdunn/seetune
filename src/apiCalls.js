import { topTracksCleaner } from './dataCleaners'

const baseUrl = 'https://api.spotify.com/v1/';
const options = (token) => ({
    "headers": {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"    
    }
  })

export const getUser = async (token) => {
  let response = await fetch(baseUrl + 'me', options(token));

  return response.json();
}

export const getTopTracks = async (token, nextUrl=null) => {
  let url = nextUrl ? nextUrl : baseUrl + 'me/top/tracks';
  let response = await fetch(url, options(token));

  return topTracksCleaner(response.json(), token);
}

//getGenres

//getAudioFeatures

