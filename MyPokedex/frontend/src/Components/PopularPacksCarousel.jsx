import React from 'react';
import { useQuery } from 'react-query';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';

const fetchPopularPacks = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5196/api/packs/GetMostPopularPacks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar pacotes mais populares');
  }
  return response.json();
};

const PopularPacksCarousel = () => {
  const navigate = useNavigate();
  const { data: packs, error, isLoading } = useQuery({
    queryKey: ['popularPacks'],
    queryFn: fetchPopularPacks,
  });

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao buscar pacotes mais populares: {error.message}</p>;
  }

  const handlePackClick = (pack) => {
    navigate(`/pack-details/${pack.id}`, { state: { pack } });
  };

  return (
    <div className="container mx-auto mt-4 ">
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

export default PopularPacksCarousel;
