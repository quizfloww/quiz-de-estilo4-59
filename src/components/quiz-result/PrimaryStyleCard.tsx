
import React from 'react';
import { Card } from '../ui/card';
import { StyleResult } from '@/types/quiz';
import { styleConfig } from '@/config/styleConfig';
import { motion } from 'framer-motion';

interface PrimaryStyleCardProps {
  primaryStyle: StyleResult;
  customDescription?: string;
  customImage?: string;
}

const PrimaryStyleCard: React.FC<PrimaryStyleCardProps> = ({
  primaryStyle,
  customDescription,
  customImage
}) => {
  const imageUrl = customImage || (styleConfig[primaryStyle.category]?.image || '');
  const description = customDescription || (styleConfig[primaryStyle.category]?.description || 'Descrição do estilo não disponível');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <Card className="p-6 bg-white mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-playfair text-[#432818] font-semibold relative"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="relative z-10">
                Seu estilo predominante é
                <span className="block mt-1 text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800"> 
                  {primaryStyle.category}
                </span>
              </span>
              <motion.div 
                className="absolute bottom-0 left-0 h-3 w-1/3 bg-amber-100 rounded-full -z-0 opacity-70"
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </motion.h2>
            
            <motion.p 
              className="text-[#432818] leading-relaxed text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <span className="inline-block h-4 w-4 rounded-full bg-amber-400"></span>
              <span className="text-sm text-[#8F7A6A] font-medium">
                Percentual: <strong>{primaryStyle.percentage}%</strong>
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="order-first md:order-last flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            {imageUrl ? (
              <div className="relative overflow-hidden rounded-xl shadow-md">
                <img 
                  src={imageUrl} 
                  alt={`Estilo ${primaryStyle.category}`} 
                  className="w-full h-auto max-h-80 object-contain z-10 relative"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-transparent z-0"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg w-full h-64 flex items-center justify-center shadow-inner">
                <p className="text-amber-700">Imagem não disponível</p>
              </div>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PrimaryStyleCard;
