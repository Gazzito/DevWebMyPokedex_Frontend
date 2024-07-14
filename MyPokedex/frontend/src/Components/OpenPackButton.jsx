import React, { useState } from 'react';  // Importa React e o hook useState
import { useQueryClient } from 'react-query';  // Importa o hook useQueryClient da biblioteca react-query

// Define o componente OpenPackButton que recebe packId e packPrice como props
const OpenPackButton = ({ packId, packPrice }) => {
  const [showModal, setShowModal] = useState(false);  // Estado para controlar a exibição do modal
  const [pokemon, setPokemon] = useState(null);  // Estado para armazenar o Pokémon obtido
  const queryClient = useQueryClient();  // Obtém o cliente de query do react-query
  const userId = localStorage.getItem('userId');  // Obtém o userId do localStorage
  const token = localStorage.getItem('authToken');  // Obtém o authToken do localStorage
  const isPackFree = packPrice === 0;  // Verifica se o pack é gratuito

  // Função para abrir o pack e obter um Pokémon aleatório
  const handleOpenPack = async () => {
    // Faz uma requisição à API para obter um Pokémon aleatório
    const response = await fetch(`http://localhost:5196/api/Pokemons/GetRandomPokemonInPack?packId=${packId}&userId=${userId}&isPackFree=${isPackFree}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao abrir o pacote');  // Lança um erro se a resposta não for bem-sucedida
    }

    const data = await response.json();  // Converte a resposta em JSON
    setPokemon(data);  // Define o Pokémon obtido no estado
    setShowModal(true);  // Exibe o modal

    // Invalida a query 'packs' para atualizar os dados dos packs
    queryClient.invalidateQueries('packs');
  };

  // Função para obter a cor da raridade do Pokémon
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
        onClick={handleOpenPack}  // Chama a função handleOpenPack ao clicar no botão
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Abrir Pacote
      </button>

      {showModal && (  // Renderiza o modal se showModal for verdadeiro
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Você recebeu um Pokémon!</h2>
            {pokemon && (  // Renderiza os detalhes do Pokémon se pokemon não for nulo
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
              onClick={() => setShowModal(false)}  // Fecha o modal ao clicar no botão
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

export default OpenPackButton;  // Exporta o componente OpenPackButton como padrão
