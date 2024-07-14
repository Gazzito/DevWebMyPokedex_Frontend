import React, { useState } from 'react';  // Importa React e useState do pacote react
import { useQuery } from 'react-query';  // Importa useQuery do pacote react-query
import { useNavigate } from 'react-router-dom';  // Importa useNavigate do pacote react-router-dom
import Navbar from './Navbar';  // Importa o componente Navbar do ficheiro Navbar

// Função para buscar os pacotes com paginação e pesquisa
const fetchPacks = async ({ queryKey }) => {
  const [
    _key,
    { page, maxRecords, searchKeyword }
  ] = queryKey;

  // Constrói os parâmetros de consulta para a URL
  const queryParams = new URLSearchParams({
    page,
    maxRecords,
    searchKeyword
  }).toString();

  // Obtém o token de autenticação do armazenamento local
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No token found');  // Lança um erro se não encontrar o token
  }

  // Faz a requisição à API para buscar os pacotes
  const response = await fetch(`http://localhost:5196/api/Packs/GetPacksWithPaginationAndSearch?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho da requisição
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');  // Lança um erro se a resposta não for bem-sucedida
  }

  return response.json();  // Retorna a resposta como JSON
};

// Componente principal da página inicial
const Home = () => {
  const navigate = useNavigate();  // Hook para navegação
  const [page, setPage] = useState(1);  // Estado para a página atual
  const [maxRecords] = useState(9);  // Estado para o número máximo de registos por página
  const [searchKeyword, setSearchKeyword] = useState('');  // Estado para o termo de pesquisa

  // Hook useQuery para buscar os pacotes
  const { data, error, isLoading, isFetching } = useQuery(
    ['packs', { page, maxRecords, searchKeyword }],
    fetchPacks,
    {
      keepPreviousData: true,  // Mantém os dados anteriores enquanto busca novos
    }
  );

  // Função para tratar o clique em um pacote
  const handlePackClick = (pack) => {
    navigate(`/pack-details/${pack.id}`, { state: { pack } });  // Navega para a página de detalhes do pacote
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
            onChange={e => setSearchKeyword(e.target.value)}  // Atualiza o estado do termo de pesquisa
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {isLoading ? (
          <div>Carregando...</div>  // Exibe uma mensagem de carregamento se os dados ainda estão sendo buscados
        ) : error ? (
          <div>Erro: {error.message}</div>  // Exibe uma mensagem de erro se houve um problema na requisição
        ) : (
          <div>
            <div className="pack-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.packs.map(pack => (
                <div
                  key={pack.id}
                  className="pack p-4 border border-gray-300 rounded shadow bg-white cursor-pointer"
                  onClick={() => handlePackClick(pack)}  // Chama a função de clique ao clicar no pacote
                >
                  <img
                    src={`data:image/jpeg;base64,${pack.image}`}  // Renderiza a imagem do pacote
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
                onClick={() => setPage(old => Math.max(old - 1, 1))}  // Decrementa a página, mas não permite ir abaixo de 1
                disabled={page === 1}  // Desativa o botão se estiver na primeira página
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-lg">Página {page}</span>  
              <button
                onClick={() => {
                  if (!isFetching && data.packs.length === maxRecords) {
                    setPage(old => old + 1);  // Incrementa a página se não estiver buscando e se há mais pacotes a serem carregados
                  }
                }}
                disabled={isFetching || data.packs.length < maxRecords}  // Desativa o botão se estiver buscando ou se não há mais pacotes a serem carregados
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

export default Home;  // Exporta o componente Home como padrão
