const express = require('express');
const querystring = require('querystring');
const request = require('request');
const cors = require('cors');

const app = express();

const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors())

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope: 'user-read-private user-read-email user-top-read user-read-recently-played user-library-read',
      redirect_uri 
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
      'Authorization': 'Basic ' + (new Buffer(
        client_id + ':' + client_secret
        ).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    let access_token = body.access_token;
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000';

    res.redirect(uri + '?access_token=' + access_token)
  })
});

let port = process.env.PORT || 8888;

app.listen(port, () => console.log('Listening on port:', port));