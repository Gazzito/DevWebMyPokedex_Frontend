import React, { useState } from 'react';  // Importa React e useState do pacote react
import { useNavigate } from 'react-router-dom';  // Importa useNavigate do pacote react-router-dom

const Login = () => {
  const [username, setUsername] = useState('');  // Estado para armazenar o nome de utilizador
  const [password, setPassword] = useState('');  // Estado para armazenar a palavra-passe
  const navigate = useNavigate();  // Hook para navegação

  // Função para tratar o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();  // Previne o comportamento padrão do formulário
    const response = await fetch('http://localhost:5196/api/Auth/Login', {
      method: 'POST',  // Define o método da requisição como POST
      headers: {
        'Content-Type': 'application/json'  // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify({ username, password })  // Converte os dados de login para JSON
    });

    if (response.ok) {
      const data = await response.json();  // Converte a resposta para JSON
      localStorage.setItem('authToken', data.token);  // Armazena o token de autenticação no armazenamento local
      localStorage.setItem('userId', data.userId);  // Armazena o ID do utilizador no armazenamento local
      navigate('/home');  // Navega para a página inicial
    } else {
      alert('Invalid username or password');  // Exibe uma mensagem de erro se o login falhar
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-black hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;  // Exporta o componente Login como padrão
