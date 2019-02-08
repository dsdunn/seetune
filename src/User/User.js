import React from 'react';
import { withRouter } from 'react-router-dom';


const User = ( {user} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        <img className='user-image'src={user.images[0].url}/>
        <div className='user-text'>
          <p>Top Tracks for</p>
          <p>{user.display_name}</p>
        </div>
      </div>
      )
  } return null;
}

export default withRouter(User);