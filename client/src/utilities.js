export const topTracksCleaner = async (token, rawTracks) => {
  rawTracks = await rawTracks;
  let trackSet = rawTracks.items.map(track => {
    let { name, album, popularity, duration_ms, id } = track;

    return ({
      id,
      title: name,
      album: album.name,
      releaseDate: album.release_date,
      coverArt: album.images[1],
      artistId: album.artists[0].id,
      artistName: album.artists[0].name,
      popularity,
      duration_ms
    })
  });

  return trackSet;
}

export const audioFeaturesCleaner = (rawFeatures) => {
  let { key, mode, time_signature, danceability, tempo, energy } = rawFeatures;

  return ({
    key,
    mode,
    time_signature,
    danceability,
    tempo,
    energy
  })
}

export const tracksByGenre = (tracks) => {
  let set = tracks.reduce((genreObj, track) => {
    let genres = track.genres;

    genres.forEach(genre => {
      if (!genreObj[genre]) {
        genreObj[genre] = [];
      }
      genreObj[genre].push(track.artistName);
      })
      return genreObj;
    }, {});

  return set;
}

export const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
}

export const cleanUser = (rawUser) => {
  console.log(rawUser)
  let { display_name } = rawUser;
  let image = rawUser.images && rawUser.images[0] ? rawUser.images[0].url : null;

  return ({ image, display_name });
}








