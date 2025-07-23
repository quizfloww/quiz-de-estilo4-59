
import { optimizeImageKitUrl } from '@/utils/imageKitUtils';

export const getStyleImage = (styleType: string): string => {
  const styleImages: Record<string, string> = {
    'Natural': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430313/GUIA_NATURAL_dlhcwm.png',
    'Clássico': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430311/GUIA_CL?SSICO_rfpptj.png',
    'Contemporâneo': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430311/GUIA_CONTEMPOR?NEO_hqqqzp.png',
    'Elegante': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430312/GUIA_ELEGANTE_mdozq9.png',
    'Romântico': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430313/GUIA_ROM?NTICO_e96ecf.png',
    'Sexy': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430314/GUIA_SEXY_i0z60a.png',
    'Dramático': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430312/GUIA_DRAM?TICO_sitfk0.png',
    'Criativo': 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430311/GUIA_CRIATIVO_sqjlwg.png'
  };
  
  const imagePath = styleImages[styleType] || styleImages['Natural'];
  return imagePath; // Retornando diretamente a URL do Cloudinary por enquanto
};
