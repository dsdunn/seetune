import React from 'react';
import logo_green from '../assets/logo_green.png';

const Login = () => {
  const handleLogin = async () => {
    window.location = process.env.REACT_APP_BACKEND_URI || '/login';
  }

  return (
    <div className="login">
      <ul>
        <li>Do you use Spotify?</li>
        <li>Do you prefer faster tempos and/or more danceable songs?</li>
        <li>How about music from a specific era?</li>
        <li>Are you going through a listening phase right now?</li> 
      </ul>
      <div className='login-button' onClick={handleLogin}>
        <p>Login with</p>
        <img src={logo_green} alt='spotify logo'/>
      </div>
    </div>
    )
}

export default Login;