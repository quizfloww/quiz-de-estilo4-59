
import React from 'react';

const MentorSection = () => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-12">
    <h3 className="text-2xl font-medium text-[#aa6b5d] mb-8 text-center">
      Sua Mentora de Estilo
    </h3>
    
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/3">
        <img 
          src="https://res.cloudinary.com/der8kogzu/image/upload/v1752430305/GISELE-GALV?O-POSE-ACESSIBILIDADE_bggaap.jpg"
          alt="Gisele Galvão - Consultora de Estilo"
          className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
        />
      </div>
      
      <div className="md:w-2/3">
        <h4 className="text-xl font-semibold text-[#432818] mb-4">Gisele Galvão</h4>
        <p className="text-[#8F7A6A] mb-4">
          Consultora de Estilo especializada em descobrir a essência única de cada mulher. 
          Com mais de 10 anos de experiência, já transformou a vida de milhares de mulheres 
          através do poder do estilo pessoal.
        </p>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span className="text-sm text-[#432818]">Especialista em Análise de Estilo</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span className="text-sm text-[#432818]">Consultora de Imagem Certificada</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span className="text-sm text-[#432818]">Mais de 5.000 mulheres transformadas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MentorSection;
