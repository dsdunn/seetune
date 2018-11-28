import { getTopTracks } from './apiCalls';
// import getGenres from './apiCalls';

export const topTracksCleaner = async (rawTracks, token) => {
  rawTracks = await rawTracks;
  let trackSet = rawTracks.items.map(track => {
    //get track's artist's genres
    //get audio-features for track: tempo, danceability, energy, time_signature
  let { name, album, popularity, duration_ms } = track;

    return ({
      title: name,
      album: album.name,
      artist: album.artists[0].name,
      genres: [],
      popularity: popularity,
      tempo: null,
      duration_ms,
      danceability: null,
      energy: null,
      time_signature: null
    })
  });

  return trackSet;
}