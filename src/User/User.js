import React from 'react';

const User = ( {user, signOut} ) => {
  if(user.display_name) {
    return (
      <div className='user'>
        {user.image && <img className='user-image' src={user.image} alt='spotify user'/>}
        <div className='user-text'>
          <p>Top Tracks for</p>
          <p>{user.display_name}</p>
        </div>
        <button onClick={signOut} className='sign-out-button'>Sign Out</button>
      </div>
      )
  } return null;
}

export default User;