import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const Login = () => {
  const handleLogin = async () => {
    window.location = 'http://localhost:8888/login';
  }

  return (
    <div className="Login">
      <button onClick={handleLogin}>login with spotify</button>
    </div>
    )
}

export default withRouter(Login);