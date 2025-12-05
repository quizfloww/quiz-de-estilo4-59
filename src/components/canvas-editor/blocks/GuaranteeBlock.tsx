import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { Shield, ShieldCheck } from 'lucide-react';

interface GuaranteeBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({ content, isPreview }) => {
  const days = content.guaranteeDays || 7;
  const title = content.guaranteeTitle || `${days} Dias de Garantia Incondicional`;
  const description = content.guaranteeDescription || 
    'Se você não ficar satisfeita com o conteúdo, basta enviar um e-mail em até 7 dias que devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.';
  const imageUrl = content.guaranteeImageUrl;

  return (
    <div className="w-full p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Ícone ou Imagem */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Garantia" 
              className="w-24 h-24 object-contain"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center justify-center md:justify-start gap-2">
            <Shield className="w-5 h-5" />
            {title}
          </h3>
          <p className="text-green-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
