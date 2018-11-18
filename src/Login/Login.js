import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const Login = () => {
  const handleLogin = async () => {
    window.location = 'http://localhost:8888/login';
  }

  return (
    <div className="App">
    hellaaaa?
      <button onClick={handleLogin}>login</button>
    </div>
    )
}

export default withRouter(Login);