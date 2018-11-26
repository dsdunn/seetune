const url = 'https://api.spotify.com/v1/';
const options = (token) => ({
    "headers": {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"    
    }
  })

export const getUser = async (token) => {
  let response = await fetch(url + 'me', options(token));

  return response.json();
}