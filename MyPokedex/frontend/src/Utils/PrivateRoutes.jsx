import React from 'react';  // Importa o React
import { Navigate } from 'react-router-dom';  // Importa o componente Navigate do react-router-dom

// Define o componente PrivateRoute
const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');  // Obtém o token de autenticação do localStorage

  // Se o authToken existir, retorna os filhos (children), caso contrário, redireciona para a página de login
  return authToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;  // Exporta o componente PrivateRoute como padrão
