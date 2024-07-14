import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Navbar from './Navbar';

const fetchTopTenPlayersWithMostOpenedPacks = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5196/api/Ranking/GetTopTenPlayersWithMostOpenedPacks', {
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

const Rank = () => {
  const [selectedTab, setSelectedTab] = useState('mostOpenedPacks');

  const { data: mostOpenedPacks, isLoading: loadingMostOpenedPacks, error: errorMostOpenedPacks } = useQuery(
    'mostOpenedPacks',
    fetchTopTenPlayersWithMostOpenedPacks
  );

  const { data: mostDiamondPokemons, isLoading: loadingMostDiamondPokemons, error: errorMostDiamondPokemons } = useQuery(
    'mostDiamondPokemons',
    fetchTopTenPlayersWithMostDiamondPokemons
  );

  const { data: mostMoney, isLoading: loadingMostMoney, error: errorMostMoney } = useQuery(
    'mostMoney',
    fetchTopTenPlayersWithMostMoney
  );

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
            <h2 className="text-xl font-bold mb-4">Top 10 Jogadores com mais Pokemons Diamond</h2>
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
            Pokemons Diamond
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

export default Rank;
