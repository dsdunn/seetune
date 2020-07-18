
const express = require('express');
const querystring = require('querystring');
const request = require('request');
const path = require('path');
const cors = require('cors');


const app = express();

const redirect_uri = process.env.REDIRECT_URI;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;


app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope: 'user-read-private user-read-email user-top-read user-read-recently-played user-library-read',
      redirect_uri,
      show_dialog: true 
    }));
});

app.get('/callback', (req, res) => {
  let code = req.query.code || null;

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(
        client_id + ':' + client_secret
        ).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    let access_token = body.access_token;
    let refresh_token = body.refresh_token;
    let uri = (process.env.FRONTEND_URI || 'http://localhost:8888') ;


    res.redirect(uri + '/#' +
      querystring.stringify({
        access_token: access_token,
        refresh_token: refresh_token
      })
    )
  })
});

app.get('/refresh', (req, res) => {
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token: refresh_token,
      redirect_uri: redirect_uri,
      grant_type: 'refresh_token'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        client_id + ':' + client_secret
        ).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    let access_token = body.access_token;
    
    if (body.refresh_token) {
      refresh_token = body.refresh_token;
    }
    res.send({
      access_token,
      refresh_token
    });
  })
  
})

let port = process.env.PORT || 8888;
console.log(process.env);

app.listen(port, () => console.log('Listening on port:', port));