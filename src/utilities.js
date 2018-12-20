export const topTracksCleaner = async (token, rawTracks) => {
  rawTracks = await rawTracks;
  let trackSet = rawTracks.items.map(track => {
    let { name, album, popularity, duration_ms, id } = track;

    return ({
      id,
      title: name,
      album: album.name,
      artistId: album.artists[0].id,
      artistName: album.artists[0].name,
      popularity,
      duration_ms,
    })
  });

  return trackSet;
}

export const audioFeaturesCleaner = (rawFeatures) => {

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

const asyncReduce = async (array, callback, startValue) => {
  let accumulator = startValue || 0;

  for (let i = 0; i < array.length; i++) {
    accumulator = await callback(accumulator, array[i])
  }
  return accumulator;
}

export const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
}

export const cleanUser = (user) => {

}






// export const tracksByGenre = async (tracks) => {
//   let set =  await tracks.reduce(async (genreObj, track) => {
//     let genres = await track.genres;

//     asyncForEach(genres, async (genre) => {
//       if (!genreObj[genre]) {
//         genreObj[genre] = [];
//       }
//       genreObj[genre].push(track)
//     })
//     return genreObj;
//   }, {})
//   console.log(set)
//   return set;
// }