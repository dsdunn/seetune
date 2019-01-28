const options = (token) => ({
    "headers": {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"    
    }
  })

export const fetchData = async (url, token) => {
  let result = await fetch(url, options(token));
  
  try {
    return result.json(); 
  } catch(error) {
    console.throw(error)
  }
}

