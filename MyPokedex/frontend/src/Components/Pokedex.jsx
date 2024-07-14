import React, { useState } from 'react';  // Importa React e useState do pacote 'react'
import { useQuery } from 'react-query';  // Importa o hook useQuery da biblioteca 'react-query'
import Navbar from './Navbar';  // Importa o componente Navbar

// Função assíncrona para buscar Pokémons com base em vários filtros
const fetchPokemons = async ({ queryKey }) => {
  const [
    _key,
    {
      userId,
      page,
      maxRecords,
      isLatest,
      rarityChoosen,
      isMostAttackSelected,
      isMostHPSelected,
      isMostDefSelected,
      isMostSpeedSelected,
      searchKeyword
    }
  ] = queryKey;  // Desestrutura os parâmetros da queryKey

  // Constrói a string de parâmetros da URL
  const queryParams = new URLSearchParams({
    userId,
    page,
    maxRecords,
    isLatest,
    rarityChoosen,
    isMostAttackSelected,
    isMostHPSelected,
    isMostDefSelected,
    isMostSpeedSelected,
    searchKeyword
  }).toString();

  const token = localStorage.getItem('authToken');  // Obtém o token de autenticação do localStorage
  if (!token) {
    throw new Error('No token found');  // Lança um erro se o token não for encontrado
  }

  // Faz uma requisição à API para buscar os Pokémons
  const response = await fetch(`http://localhost:5196/api/Pokemons/GetAllOwnedPokemonsWithFiltersWithPaginationAndSearch?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');  // Lança um erro se a resposta não for bem-sucedida
  }

  return response.json();  // Converte a resposta em JSON
};

// Componente principal da Pokedex
const Pokedex = () => {
  const userId = localStorage.getItem('userId');  // Obtém o userId do localStorage
  const [page, setPage] = useState(1);  // Define o estado para a página atual
  const [maxRecords] = useState(10);  // Define o número máximo de registros por página
  const [isLatest] = useState(true);  // Define o estado para o filtro "isLatest"
  const [rarityChoosen, setRarityChoosen] = useState('');  // Define o estado para a raridade escolhida
  const [isMostAttackSelected, setMostAttackSelected] = useState(false);  // Define o estado para o filtro de maior ataque
  const [isMostHPSelected, setMostHPSelected] = useState(false);  // Define o estado para o filtro de maior vida
  const [isMostDefSelected, setMostDefSelected] = useState(false);  // Define o estado para o filtro de maior defesa
  const [isMostSpeedSelected, setMostSpeedSelected] = useState(false);  // Define o estado para o filtro de maior velocidade
  const [searchKeyword, setSearchKeyword] = useState('');  // Define o estado para a palavra-chave de pesquisa

  // Usa o hook useQuery para buscar os Pokémons com base nos filtros e paginação
  const { data, error, isLoading, isFetching } = useQuery(
    ['pokemons', { userId, page, maxRecords, isLatest, rarityChoosen, isMostAttackSelected, isMostHPSelected, isMostDefSelected, isMostSpeedSelected, searchKeyword }],
    fetchPokemons,
    {
      keepPreviousData: true,  // Mantém os dados anteriores enquanto busca os novos
    }
  );

  // Função para obter a cor de acordo com a raridade do Pokémon
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Bronze':
        return 'text-orange-800';
      case 'Silver':
        return 'text-gray-500';
      case 'Gold':
        return 'text-yellow-500';
      case 'Platinum':
        return 'text-blue-500';
      case 'Diamond':
        return 'text-teal-500';
      default:
        return '';
    }
  };

  // Renderiza o componente Pokedex
  return (
    <>
      <Navbar />  
      <div className="pokedex p-6 bg-gradient-to-r from-yellow-400 to-orange-500 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Pokedex</h1>
        
        <div className="filters flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={rarityChoosen}
            onChange={e => setRarityChoosen(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Todas</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Diamond">Diamond</option>
          </select>
          <button
            onClick={() => setMostAttackSelected(!isMostAttackSelected)}
            className={`p-2 rounded ${isMostAttackSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Máximo Ataque
          </button>
          <button
            onClick={() => setMostHPSelected(!isMostHPSelected)}
            className={`p-2 rounded ${isMostHPSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Máximo Vida
          </button>
          <button
            onClick={() => setMostDefSelected(!isMostDefSelected)}
            className={`p-2 rounded ${isMostDefSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Máximo Defesa
          </button>
          <button
            onClick={() => setMostSpeedSelected(!isMostSpeedSelected)}
            className={`p-2 rounded ${isMostSpeedSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Máximo Velocidade
          </button>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div>Erro: {error.message}</div>
        ) : (
          <div>
            <div className="pokemon-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.pokemons.map(pokemon => (
                <div key={pokemon.id} className="pokemon p-4 border border-gray-300 rounded shadow bg-white">
                  <img
                    src={`data:image/jpeg;base64,${pokemon.image}`}
                    alt={pokemon.pokemonName}
                    className="h-32 w-full object-cover mb-2"
                  />
                  <h3 className="text-xl font-bold mb-2">{pokemon.pokemonName}</h3>
                  <p className={getRarityColor(pokemon.rarity) + ' font-bold'}>{pokemon.rarity}</p>
                  <p><span className='font-semibold'>Ataque:</span> {pokemon.actualAttackPoints}</p>
                  <p><span className='font-semibold'>Vida:</span> {pokemon.actualHealthPoints}</p>
                  <p><span className='font-semibold'>Defesa:</span> {pokemon.actualDefensePoints}</p>
                  <p><span className='font-semibold'>Velocidade:</span> {pokemon.actualSpeedPoints}</p>
                  <p><span className='font-semibold'>Total Combate:</span> {pokemon.totalCombatPoints}</p>
                </div>
              ))}
            </div>
            <div className="pagination flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(old => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-lg">Página {page}</span>
              <button
                onClick={() => {
                  if (!isFetching && data.pokemons.length === maxRecords) {
                    setPage(old => old + 1);
                  }
                }}
                disabled={isFetching || data.pokemons.length < maxRecords}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Seguinte
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pokedex;  // Exporta o componente Pokedex como padrão
