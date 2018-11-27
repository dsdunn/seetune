import React from 'react';
import { withRouter } from 'react-router-dom';

const User = ( {user} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        <p>user:</p>
        <h3>{user.display_name}</h3>
        <img src={user.images[0].url}/>
      </div>
      )
  } return null;
}

export default withRouter(User);