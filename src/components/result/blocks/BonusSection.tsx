
import React from 'react';

const bonusItems = [
  {
    id: 1,
    title: 'Guia de Visagismo',
    description: 'Maquiagem ideal para seu rosto',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752444310/MOCKUP_TABLET_VISAGISMO_kq6yew.png'
  },
  {
    id: 2,
    title: 'Peças-Chave do Seu Estilo',
    description: 'Guia completo das peças essenciais',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752444259/MOCKUPS_REVISTA_CELULAR_GUIA_DE_ESTILO_wd8uec.png'
  },
  {
    id: 3,
    title: 'Quiz dos 8 Estilos',
    description: 'Identifique seu estilo predominante',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752431503/Estilos_Universais_Quiz_1_rklt2f.png'
  },
  {
    id: 4,
    title: 'Guia Completo',
    description: 'Todos os estilos universais',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430325/MOCKUPS_DE_TODOS_OS_PRODUTOS_-_GUIAS_DE_ESILOS_E_B?NUS_-_COM_FUNDO_o9dmxb.png'
  }
];

const BonusSection = () => (
  <div className="bg-gradient-to-r from-[#fff8f4] to-[#faf5f0] p-8 rounded-xl border border-[#B89B7A]/20 shadow-md">
    <h3 className="text-xl md:text-2xl font-medium text-[#aa6b5d] mb-6 text-center">
      🎁 Bônus Exclusivos Inclusos
    </h3>
    <div className="grid md:grid-cols-2 gap-6">
      {bonusItems.map((item) => (
        <div key={item.id} className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-32 object-contain mx-auto mb-3"
            />
            <h4 className="font-semibold text-[#432818] mb-2">{item.title}</h4>
            <p className="text-sm text-[#8F7A6A]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BonusSection;
