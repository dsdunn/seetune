import { getTopTracks, getGenres } from './apiCalls';

export const topTracksCleaner = async (token, rawTracks) => {
  rawTracks = await rawTracks;
  let trackSet = rawTracks.items.map(track => {
    //get audio-features for track: tempo, danceability, energy, time_signature
  let { name, album, popularity, duration_ms } = track;
  let genres = getGenres(token, album.artists[0].id);

    return ({
      title: name,
      album: album.name,
      artist: album.artists[0].name,
      genres,
      popularity,
      tempo: null,
      duration_ms,
      danceability: null,
      energy: null,
      time_signature: null
    })
  });

  return trackSet;
}