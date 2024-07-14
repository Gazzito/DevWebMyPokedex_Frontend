import React, { useState } from 'react';  // Importa o React e o hook useState
import { useQuery } from 'react-query';  // Importa o hook useQuery da biblioteca react-query
import Navbar from './Navbar';  // Importa o componente Navbar

// Função assíncrona para buscar os 10 melhores jogadores com mais pacotes abertos
const fetchTopTenPlayersWithMostOpenedPacks = async () => {
  const token = localStorage.getItem('authToken');  // Obtém o token de autenticação do localStorage
  const response = await fetch('http://localhost:5196/api/Ranking/GetTopTenPlayersWithMostOpenedPacks', {
    headers: {
      'Authorization': `Bearer ${token}`,  // Adiciona o token de autenticação no cabeçalho da requisição
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');  // Lança um erro se a resposta não for bem-sucedida
  }

  return response.json();  // Converte a resposta em JSON
};

// Função assíncrona para buscar os 10 melhores jogadores com mais Pokémons Diamond
const fetchTopTenPlayersWithMostDiamondPokemons = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5196/api/Ranking/GetTopTenPlayersWithMostDiamondPokemons', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Função assíncrona para buscar os 10 melhores jogadores com mais dinheiro
const fetchTopTenPlayersWithMostMoney = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5196/api/Ranking/GetTopTenPlayersWithMostMoney', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Componente Rank
const Rank = () => {
  const [selectedTab, setSelectedTab] = useState('mostOpenedPacks');  // Estado para controlar a aba selecionada

  // UseQuery para buscar os dados dos jogadores com mais pacotes abertos
  const { data: mostOpenedPacks, isLoading: loadingMostOpenedPacks, error: errorMostOpenedPacks } = useQuery(
    'mostOpenedPacks',
    fetchTopTenPlayersWithMostOpenedPacks
  );

  // UseQuery para buscar os dados dos jogadores com mais Pokémons Diamond
  const { data: mostDiamondPokemons, isLoading: loadingMostDiamondPokemons, error: errorMostDiamondPokemons } = useQuery(
    'mostDiamondPokemons',
    fetchTopTenPlayersWithMostDiamondPokemons
  );

  // UseQuery para buscar os dados dos jogadores com mais dinheiro
  const { data: mostMoney, isLoading: loadingMostMoney, error: errorMostMoney } = useQuery(
    'mostMoney',
    fetchTopTenPlayersWithMostMoney
  );

  // Função para renderizar o conteúdo da aba selecionada
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'mostOpenedPacks':
        if (loadingMostOpenedPacks) return <p>Loading...</p>;
        if (errorMostOpenedPacks) return <p>Error: {errorMostOpenedPacks.message}</p>;
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Top 10 Jogadores com mais Packs Abertos</h2>
            {mostOpenedPacks.map((player, index) => (
              <div key={player.userId} className="p-4 border rounded mb-2 bg-white">
                <p><strong>#{index + 1}</strong> {player.userName}</p>
                <p>Total: {player.totalPacksOpened}</p>
              </div>
            ))}
          </div>
        );
      case 'mostDiamondPokemons':
        if (loadingMostDiamondPokemons) return <p>Loading...</p>;
        if (errorMostDiamondPokemons) return <p>Error: {errorMostDiamondPokemons.message}</p>;
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Top 10 Jogadores com mais Pokémons Diamond</h2>
            {mostDiamondPokemons.map((player, index) => (
              <div key={player.userId} className="p-4 border rounded mb-2 bg-white">
                <p><strong>#{index + 1}</strong> {player.userName}</p>
                <p>Total: {player.totalDiamondPokemons}</p>
              </div>
            ))}
          </div>
        );
      case 'mostMoney':
        if (loadingMostMoney) return <p>Carregando...</p>;
        if (errorMostMoney) return <p>Erro: {errorMostMoney.message}</p>;
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Top 10 Jogadores com mais Dinheiro</h2>
            {mostMoney.map((player, index) => (
              <div key={player.userId} className="p-4 border rounded mb-2 bg-white">
                <p><strong>#{index + 1}</strong> {player.userName}</p>
                <p>Dinheiro: {player.money}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar /> 
      <div className="ranking p-6 bg-gradient-to-r from-yellow-400 to-orange-500 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Ranking</h1>
        <div className="tabs flex justify-around mb-6">
          <button
            className={`p-2 rounded ${selectedTab === 'mostOpenedPacks' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setSelectedTab('mostOpenedPacks')}
          >
            Packs Abertos
          </button>
          <button
            className={`p-2 rounded ${selectedTab === 'mostDiamondPokemons' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setSelectedTab('mostDiamondPokemons')}
          >
            Pokémons Diamond
          </button>
          <button
            className={`p-2 rounded ${selectedTab === 'mostMoney' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setSelectedTab('mostMoney')}
          >
            Dinheiro
          </button>
        </div>
        {renderTabContent()}  
      </div>
    </>
  );
};

export default Rank;  // Exporta o componente Rank como padrão
