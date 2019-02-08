import React from 'react';
import { withRouter } from 'react-router-dom';


const User = ( {user, signOut} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        <img className='user-image' src={user.images[0].url} alt='spotify user'/>
        <div className='user-text'>
          <p>Top Tracks for</p>
          <p>{user.display_name}</p>
        </div>
        <button onClick={signOut} className='sign-out-button'>Sign Out</button>
      </div>
      )
  } return null;
}

export default withRouter(User);