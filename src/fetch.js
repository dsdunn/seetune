const options = (token) => ({
    "headers": {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"    
    }
  })

export const fetchData = async (url, token) => {
  let result = await fetch(url, options(token));
  return result.json();
}

