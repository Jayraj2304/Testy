
import React from 'react';

const Header = ({ userInfo }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      color: 'white',
      borderBottom: '1px solid #333'
    }}>
      <h1>TESTY</h1>
      {userInfo && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '1rem' }}>{userInfo.name}</span>
          <img src={userInfo.avatar_url} alt="User Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
      )}
    </header>
  );
};

export default Header;
