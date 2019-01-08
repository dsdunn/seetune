import React from 'react';
import { withRouter } from 'react-router-dom';

import './User.css';

const User = ( {user} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        <p class='user-name'>Hi, <br/>{user.display_name}</p>
        <img class='user-image'src={user.images[0].url}/>
      </div>
      )
  } return null;
}

export default withRouter(User);