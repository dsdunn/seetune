import React from 'react';
import { withRouter } from 'react-router-dom';

import './User.css';

const User = ( {user} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        <p className='user-name'>Hi, <br/>{user.display_name}</p>
        <img className='user-image'src={user.images[0].url}/>
      </div>
      )
  } return null;
}

export default withRouter(User);