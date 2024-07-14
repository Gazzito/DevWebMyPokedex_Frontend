import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const fetchPacks = async ({ queryKey }) => {
  const [
    _key,
    { page, maxRecords, searchKeyword }
  ] = queryKey;

  const queryParams = new URLSearchParams({
    page,
    maxRecords,
    searchKeyword
  }).toString();

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`http://localhost:5196/api/Packs/GetPacksWithPaginationAndSearch?${queryParams}`, {
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

const Home = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [maxRecords] = useState(9);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, error, isLoading, isFetching } = useQuery(
    ['packs', { page, maxRecords, searchKeyword }],
    fetchPacks,
    {
      keepPreviousData: true,
    }
  );

  const handlePackClick = (pack) => {
    navigate(`/pack-details/${pack.id}`, { state: { pack } });
  };

  return (
    <>
      <Navbar />
      <div className="home p-6 bg-gradient-to-r from-yellow-400 to-orange-500 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Pacotes Mais Populares</h1>
        
        <div className="filters flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div>Erro: {error.message}</div>
        ) : (
          <div>
            <div className="pack-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.packs.map(pack => (
                <div
                  key={pack.id}
                  className="pack p-4 border border-gray-300 rounded shadow bg-white cursor-pointer"
                  onClick={() => handlePackClick(pack)}
                >
                  <img
                    src={`data:image/jpeg;base64,${pack.image}`}
                    alt={pack.name}
                    className="h-32 w-full object-cover mb-2"
                  />
                  <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
                  <p>Preço: {pack.price}</p>
                  <p>Total Comprado: {pack.totalBought}</p>
                  <p><span className="font-bold text-orange-800">Bronze:</span> {pack.bronzeChance}%</p>
                  <p><span className="font-bold text-gray-500">Silver:</span> {pack.silverChance}%</p>
                  <p><span className="font-bold text-yellow-500">Gold:</span> {pack.goldChance}%</p>
                  <p><span className="font-bold text-blue-500">Platinum:</span> {pack.platinumChance}%</p>
                  <p><span className="font-bold text-teal-500">Diamond:</span> {pack.diamondChance}%</p>
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
                  if (!isFetching && data.packs.length === maxRecords) {
                    setPage(old => old + 1);
                  }
                }}
                disabled={isFetching || data.packs.length < maxRecords}
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

export default Home;