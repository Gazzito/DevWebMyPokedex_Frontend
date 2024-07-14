import React from 'react';  // Importa a biblioteca React
import { useQuery } from 'react-query';  // Importa o hook useQuery da biblioteca react-query
import { Carousel } from 'react-responsive-carousel';  // Importa o componente Carousel da biblioteca react-responsive-carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css';  // Importa os estilos CSS para o carrossel
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate da biblioteca react-router-dom

// Função assíncrona para buscar os pacotes mais populares
const fetchPopularPacks = async () => {
  const token = localStorage.getItem('authToken');  // Obtém o token de autenticação do localStorage
  const response = await fetch('http://localhost:5196/api/packs/GetMostPopularPacks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Adiciona o token de autenticação no cabeçalho da requisição
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar pacotes mais populares');  // Lança um erro se a resposta não for bem-sucedida
  }
  return response.json();  // Converte a resposta em JSON
};

// Componente para exibir o carrossel de pacotes populares
const PopularPacksCarousel = () => {
  const navigate = useNavigate();  // Hook para navegar entre as rotas
  const { data: packs, error, isLoading } = useQuery({
    queryKey: ['popularPacks'],  // Chave única para a query
    queryFn: fetchPopularPacks,  // Função que busca os dados
  });

  // Renderiza um indicador de carregamento enquanto a query está em andamento
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  // Renderiza uma mensagem de erro se a query falhar
  if (error) {
    return <p>Erro ao buscar pacotes mais populares: {error.message}</p>;
  }

  // Função para lidar com o clique no pacote
  const handlePackClick = (pack) => {
    navigate(`/pack-details/${pack.id}`, { state: { pack } });  // Navega para a página de detalhes do pacote
  };

  // Renderiza o carrossel de pacotes populares
  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Pacotes Mais Populares</h2>
      {packs && packs.length > 0 ? (
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true}>
          {packs.map(pack => (
            <div key={pack.id} className="p-4" onClick={() => handlePackClick(pack)}>
              <img src={`data:image/jpeg;base64,${pack.image}`} alt={pack.name} className="h-48 w-full object-cover" />
              <div className="p-2">
                <h3 className="text-lg font-bold">{pack.name}</h3>
                <p>Preço: {pack.price}</p>
                <p>Total Comprado: {pack.totalBought}</p>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <p>Nenhum pacote encontrado.</p>
      )}
    </div>
  );
};

export default PopularPacksCarousel;  // Exporta o componente PopularPacksCarousel como padrão
