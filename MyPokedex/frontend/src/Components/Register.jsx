import React, { useState } from 'react';  // Importa o React e o hook useState
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate do react-router-dom

// Componente Register
const Register = () => {
  const [name, setName] = useState('');  // Estado para armazenar o nome
  const [username, setUsername] = useState('');  // Estado para armazenar o nome de utilizador
  const [email, setEmail] = useState('');  // Estado para armazenar o email
  const [password, setPassword] = useState('');  // Estado para armazenar a palavra-passe
  const navigate = useNavigate();  // Hook para navegar entre páginas

  // Função assíncrona para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();  // Previne o comportamento padrão do formulário
    const response = await fetch('http://localhost:5196/api/Auth/Register', {
      method: 'POST',  // Define o método HTTP como POST
      headers: {
        'Content-Type': 'application/json'  // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify({ name, username, email, password })  // Converte os dados para JSON
    });

    if (response.ok) {
      navigate('/login');  // Navega para a página de login se o registo for bem-sucedido
    } else {
      alert('Error registering user');  // Mostra um alerta em caso de erro no registo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required  // Campo obrigatório
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required  // Campo obrigatório
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required  // Campo obrigatório
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required  // Campo obrigatório
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-600"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-black hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;  // Exporta o componente Register como padrão
