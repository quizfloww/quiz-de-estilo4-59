import React from 'react';
import { Crown } from 'lucide-react'; 
import { StyleResult } from '@/types/quiz'; 
import { useAuth } from '@/context/AuthContext'; 
import { Card } from '@/components/ui/card'; // Certifique-se de que Card está importado aqui

interface HeaderProps {
  primaryStyle?: StyleResult; 
  logoHeight?: number;
  logo?: string;
  logoAlt?: string;
  userName?: string;
  isScrolled?: boolean; // Mantendo props existentes por segurança
  className?: string; // Mantendo props existentes por segurança
}

export const Header: React.FC<HeaderProps> = ({
  primaryStyle, 
  logoHeight = 50,
  logo,
  logoAlt = "Logo",
  userName,
  isScrolled,
  className = ''
}) => {
  const { user } = useAuth();
  const displayName = userName || user?.userName || 'Visitante';

  return (
    // AJUSTE AQUI: mb- para diminuir o espaçamento para a próxima seção
    <Card className={`bg-white shadow-sm p-6 mb-4 md:mb-6 border-0 ${className}`}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex justify-center w-full">
          <img
            src={logo}
            alt={logoAlt}
            className="h-auto mx-auto"
            style={{ height: `${logoHeight}px`, maxWidth: '100%' }}
          />
        </div>
        
        {/* AJUSTE AQUI: leading-relaxed no h1 para aumentar o espaçamento da linha */}
        <h1 className="text-xl md:text-2xl font-playfair text-[#432818] leading-relaxed"> {/* Alterado leading-tight para leading-relaxed */}
          Parabéns, <span className="font-bold">{displayName}</span>!
          <br className="sm:hidden" /> 
          <span className="text-xl md:text-2xl text-[#aa6b5d]"> Seu Estilo Predominante é:</span>
        </h1>
        
      </div>
    </Card>
  );
};