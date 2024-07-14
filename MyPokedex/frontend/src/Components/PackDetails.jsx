import React, { useEffect, useState } from "react";  // Importa React, useEffect e useState do pacote 'react'
import { useLocation, useParams } from "react-router-dom";  // Importa useLocation e useParams do pacote 'react-router-dom'
import { useQuery } from "react-query";  // Importa o hook useQuery da biblioteca 'react-query'
import OpenPackButton from "./OpenPackButton";  // Importa o componente OpenPackButton
import Navbar from "./Navbar";  // Importa o componente Navbar

// Função para buscar os detalhes de um pack
const fetchPackDetails = async (packId) => {
  const token = localStorage.getItem("authToken");  // Obtém o token de autenticação do localStorage
  const response = await fetch(
    `http://localhost:5196/api/packs/GetPackDetails?packId=${packId}`,  // Faz uma requisição à API para obter os detalhes do pack
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do pacote");  // Lança um erro se a resposta não for bem-sucedida
  }
  return response.json();  // Converte a resposta em JSON
};

// Função para buscar os Pokémons dentro de um pack
const fetchPokemonsInPack = async (packId) => {
  const token = localStorage.getItem("authToken");  // Obtém o token de autenticação do localStorage
  const response = await fetch(
    `http://localhost:5196/api/pokemoninpack/GetPokemonsInPack?packId=${packId}`,  // Faz uma requisição à API para obter os Pokémons no pack
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar pokémons no pacote");  // Lança um erro se a resposta não for bem-sucedida
  }
  return response.json();  // Converte a resposta em JSON
};

// Componente principal para exibir os detalhes de um pack
const PackDetails = () => {
  const location = useLocation();  // Obtém a localização atual
  const { id } = useParams();  // Obtém o ID do pack a partir dos parâmetros da URL
  const [pack, setPack] = useState(location.state?.pack || null);  // Define o estado inicial do pack
  const [loadingPack, setLoadingPack] = useState(!pack);  // Define o estado de carregamento do pack
  const [errorPack, setErrorPack] = useState(null);  // Define o estado de erro do pack

  // Hook useEffect para buscar os detalhes do pack se não estiverem disponíveis no estado inicial
  useEffect(() => {
    if (!pack) {
      fetchPackDetails(id)
        .then(data => {
          setPack(data);  // Define os detalhes do pack no estado
          setLoadingPack(false);  // Define o estado de carregamento como falso
        })
        .catch(error => {
          setErrorPack(error);  // Define o erro no estado
          setLoadingPack(false);  // Define o estado de carregamento como falso
        });
    }
  }, [id, pack]);

  // Hook useQuery para buscar os Pokémons dentro do pack
  const {
    data: pokemons,
    error: errorPokemons,
    isLoading: isLoadingPokemons,
  } = useQuery(["pokemonsInPack", id], () => fetchPokemonsInPack(id));

  // Renderiza uma mensagem de carregamento enquanto os detalhes do pack estão a ser carregados
  if (loadingPack) {
    return <p>Carregando detalhes do pacote...</p>;
  }

  // Renderiza uma mensagem de erro se ocorrer um erro ao buscar os detalhes do pack
  if (errorPack) {
    return <p>Erro ao buscar detalhes do pacote: {errorPack.message}</p>;
  }

  // Renderiza uma mensagem de carregamento enquanto os Pokémons no pack estão a ser carregados
  if (isLoadingPokemons) {
    return <p>Carregando pokémons no pacote...</p>;
  }

  // Renderiza uma mensagem de erro se ocorrer um erro ao buscar os Pokémons no pack
  if (errorPokemons) {
    return <p>Erro ao buscar pokémons no pacote: {errorPokemons.message}</p>;
  }

  // Renderiza o conteúdo principal da página
  return (
    <>
      <Navbar /> 
      <div className="container mx-auto p-10 bg-gradient-to-r from-yellow-400 to-orange-500 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{pack.name}</h2>
        <p>Preço: {pack.price}</p>
        <p>Total Comprado: {pack.totalBought}</p>
        <OpenPackButton packId={pack.id} packPrice={pack.price} /> 
        <h3 className="text-xl font-bold mt-4">Pokémons no Pacote</h3>
        {pokemons && pokemons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {pokemons.map((pokemon) => (
              <div key={pokemon.id} className="p-4 border rounded bg-white">
                <img
                  src={`data:image/jpeg;base64,${pokemon.image}`}
                  alt={pokemon.name}
                  className="h-32 w-full object-cover mb-2"
                />
                <h4 className="text-lg font-bold">{pokemon.name}</h4>
                <p>Ataque: {pokemon.baseAttackPoints}</p>
                <p>Defesa: {pokemon.baseDefensePoints}</p>
                <p>Vida: {pokemon.baseHealthPoints}</p>
                <p>Velocidade: {pokemon.baseSpeedPoints}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum pokémon encontrado neste pacote.</p>
        )}
      </div>
    </>
  );
};

export default PackDetails;  // Exporta o componente PackDetails como padrão
