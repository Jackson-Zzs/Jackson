import React from 'react';

function LogOut ({ onLogout, token }) {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5005/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onLogout();
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <button aria-label="log out button" onClick={handleLogout}>Logout</button>;
}

export default LogOut;
