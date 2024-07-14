import React from 'react';  // Importa a biblioteca React
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate do react-router-dom

const LogoutButton = () => {
  const navigate = useNavigate();  // Obtém a função de navegação para redirecionamento

  // Função para tratar o logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove o token de autenticação do armazenamento local
    navigate('/login');  // Redireciona o utilizador para a página de login
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
};

export default LogoutButton;  // Exporta o componente LogoutButton como padrão
