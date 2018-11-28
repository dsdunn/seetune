import { getTopTracks, getGenres, getAudioFeatures } from './apiCalls';

export const topTracksCleaner = async (token, rawTracks) => {
  rawTracks = await rawTracks;
  let trackSet = rawTracks.items.map(track => {
    //get audio-features for track: tempo, danceability, energy, time_signature
  let { name, album, popularity, duration_ms, id } = track;
  let genres = getGenres(token, album.artists[0].id);

    return ({
      id,
      title: name,
      album: album.name,
      artist: album.artists[0].name,
      genres,
      popularity,
      duration_ms,
      audioFeatures: {
        tempo: null,
        danceability: null,
        energy: null,
        time_signature: null
      }
    })
  });

  return trackSet;
}