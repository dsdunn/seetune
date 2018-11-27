import React from 'react';
import { withRouter } from 'react-router-dom';

const User = ( {user} ) => {
  return (
    <div className='user'>
      <p>user:</p>
      <h3>{user.display_name}</h3>
      <img src={user.images[0].url}/>
    </div>
    )
}

export default withRouter(User);