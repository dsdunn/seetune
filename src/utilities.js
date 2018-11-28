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

export const tracksByGenre = (tracks) => {
  let trackSet = asyncReduce(tracks, async (set, track) => {
    let genres = await track.genres;

    asyncForEach(genres, (genre) => {
      if (!set[genre]) {
        set[genre] = [];
      }
      set[genre].push(track)
    })
    return set;
  }, {})
  return trackSet
}

const asyncReduce = async (array, callback, startValue) => {
  let accumulator = startValue || 0;

  for (let i = 0; i < array.length; i++) {
    accumulator = await callback(accumulator, array[i])
  }
  return accumulator;
}

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
}

export const cleanUser = (user) => {

}