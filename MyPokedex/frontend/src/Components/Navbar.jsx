import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/home" className="text-white text-lg font-bold">Home</Link>
          <Link to="/pokedex" className="text-gray-300 hover:text-white ml-4">Pokedex</Link>
          <Link to="/rank" className="text-gray-300 hover:text-white ml-4">Ranking</Link>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
