
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sônia',
    text: 'Incrível como descobrir meu estilo mudou minha autoestima. Agora sei exatamente o que comprar!',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_S?NIA_q0g9cq.png'
  },
  {
    id: 2,
    name: 'Patrícia',
    text: 'O guia é muito completo! Finalmente entendi como valorizar meu corpo e personalidade.',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_PATR?CIA_x0mhud.png'
  },
  {
    id: 3,
    name: 'Mariangela',
    text: 'Transformação incrível! Antes eu comprava por impulso, agora tenho direcionamento claro.',
    image: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_MARIANGELA_sj7lki.png'
  }
];

const TestimonialsBlock = () => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-12">
    <h3 className="text-2xl font-medium text-[#aa6b5d] mb-8 text-center">
      O que dizem nossas clientes
    </h3>
    
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-[#f9f6f3] p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <img 
              src={testimonial.image} 
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <p className="font-medium text-[#432818]">{testimonial.name}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-[#432818] text-sm italic">
            "{testimonial.text}"
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default TestimonialsBlock;
