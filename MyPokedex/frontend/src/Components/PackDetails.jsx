import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import OpenPackButton from "./OpenPackButton";
import Navbar from "./Navbar";

const fetchPackDetails = async (packId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `http://localhost:5196/api/packs/GetPackDetails?packId=${packId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do pacote");
  }
  return response.json();
};

const fetchPokemonsInPack = async (packId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `http://localhost:5196/api/pokemoninpack/GetPokemonsInPack?packId=${packId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar pokémons no pacote");
  }
  return response.json();
};

const PackDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const [pack, setPack] = useState(location.state?.pack || null);
  const [loadingPack, setLoadingPack] = useState(!pack);
  const [errorPack, setErrorPack] = useState(null);

  useEffect(() => {
    if (!pack) {
      fetchPackDetails(id)
        .then(data => {
          setPack(data);
          setLoadingPack(false);
        })
        .catch(error => {
          setErrorPack(error);
          setLoadingPack(false);
        });
    }
  }, [id, pack]);

  const {
    data: pokemons,
    error: errorPokemons,
    isLoading: isLoadingPokemons,
  } = useQuery(["pokemonsInPack", id], () => fetchPokemonsInPack(id));

  if (loadingPack) {
    return <p>Carregando detalhes do pacote...</p>;
  }

  if (errorPack) {
    return <p>Erro ao buscar detalhes do pacote: {errorPack.message}</p>;
  }

  if (isLoadingPokemons) {
    return <p>Carregando pokémons no pacote...</p>;
  }

  if (errorPokemons) {
    return <p>Erro ao buscar pokémons no pacote: {errorPokemons.message}</p>;
  }

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

export default PackDetails;
