import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

const OpenPackButton = ({ packId, packPrice }) => {
  const [showModal, setShowModal] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const isPackFree = packPrice === 0;

  const handleOpenPack = async () => {
    const response = await fetch(`http://localhost:5196/api/Pokemons/GetRandomPokemonInPack?packId=${packId}&userId=${userId}&isPackFree=${isPackFree}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao abrir o pacote');
    }

    const data = await response.json();
    setPokemon(data);
    setShowModal(true);

    // Refetch packs data to update the pack details
    queryClient.invalidateQueries('packs');
  };

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

  return (
    <div>
      <button
        onClick={handleOpenPack}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Abrir Pacote
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Você recebeu um Pokémon!</h2>
            {pokemon && (
              <>
                <img
                  src={`data:image/jpeg;base64,${pokemon.image}`}
                  alt={pokemon.pokemon}
                  className="h-32 w-full object-cover mb-2"
                />
                <div className='font-bold text-center'><p> {pokemon.pokemon}</p></div>
                <div className='font-bold text-center'> <p className={getRarityColor(pokemon.rarity) + ' font-bold'}>{pokemon.rarity}</p></div>
              </>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenPackButton;
