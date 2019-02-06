import React from 'react';
import logo_green from '../assets/logo_green.png';

const Login = () => {
  const handleLogin = async () => {
    window.location = process.env.BACKEND_URI || 'http://localhost:8888/login';
  }

  return (
    <div className="login">
      <p>Do you use Spotify? Do you prefer faster tempos and/or more danceable songs? How about music from a specific era? Are you going through a listening phase right now? Login to explore info about your short-, medium-, and long-term top tracks!
      </p>
      <button onClick={handleLogin}>Login with <img src={logo_green}/></button>
    </div>
    )
}

export default Login;