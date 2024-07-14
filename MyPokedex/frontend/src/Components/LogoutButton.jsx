import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
};

export default LogoutButton;
