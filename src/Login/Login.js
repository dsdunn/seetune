import React from 'react';

const Login = () => {
  const handleLogin = async () => {
    window.location = process.env.BACKEND_URI || 'http://localhost:8888/login';
  }

  return (
    <div className="Login">
      <button onClick={handleLogin}>login with spotify</button>
    </div>
    )
}

export default Login;