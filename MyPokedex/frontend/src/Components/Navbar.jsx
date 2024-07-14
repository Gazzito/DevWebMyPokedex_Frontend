import React from 'react';  // Importa a biblioteca React
import { Link } from 'react-router-dom';  // Importa o componente Link do react-router-dom para navegação
import LogoutButton from './LogoutButton';  // Importa o componente LogoutButton

// Define o componente Navbar
const Navbar = () => {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Div para os links de navegação */}
        <div>
          {/* Link para a página inicial */}
          <Link to="/home" className="text-white text-lg font-bold">Home</Link>
          {/* Link para a página do Pokedex */}
          <Link to="/pokedex" className="text-gray-300 hover:text-white ml-4">Pokedex</Link>
          {/* Link para a página de Ranking */}
          <Link to="/rank" className="text-gray-300 hover:text-white ml-4">Ranking</Link>
        </div>
        {/* Div para o botão de logout */}
        <div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  // Exporta o componente Navbar como padrão
