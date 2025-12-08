-- Migration: Atualizar etapa de resultado do funil para usar blocos modulares
-- Data: 2025-12-08
-- 
-- IMPORTANTE: Este script atualiza o campo 'config' da etapa de resultado
-- para incluir os blocos modulares que serão renderizados pelo DynamicStageRenderer.
--
-- Para aplicar esta migração, execute:
-- 1. No Supabase Dashboard: SQL Editor -> New Query -> Cole este script
-- 2. Ou via CLI: supabase db push
--
-- O funil deve estar publicado (status = 'published') para as alterações
-- serem visíveis no quiz público.

-- Primeiro, vamos identificar o funil "Quiz de Estilo Pessoal"
-- e sua última etapa (etapa 20 ou tipo 'result')

DO $$
DECLARE
    v_funnel_id UUID;
    v_stage_id UUID;
    v_stage_order INT;
    v_blocks_config JSONB;
BEGIN
    -- Encontrar o funil pelo nome ou slug
    SELECT id INTO v_funnel_id
    FROM funnels
    WHERE name ILIKE '%Quiz de Estilo Pessoal%'
       OR slug ILIKE '%quiz%'
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_funnel_id IS NULL THEN
        RAISE NOTICE 'Funil "Quiz de Estilo Pessoal" não encontrado. Pulando migração.';
        RETURN;
    END IF;

    RAISE NOTICE 'Funil encontrado: %', v_funnel_id;

    -- Encontrar a etapa de resultado (última etapa ou tipo 'result')
    SELECT id, order_index INTO v_stage_id, v_stage_order
    FROM funnel_stages
    WHERE funnel_id = v_funnel_id
      AND (type = 'result' OR type = 'offer')
    ORDER BY order_index DESC
    LIMIT 1;

    IF v_stage_id IS NULL THEN
        -- Se não encontrar etapa de resultado, pegar a última etapa
        SELECT id, order_index INTO v_stage_id, v_stage_order
        FROM funnel_stages
        WHERE funnel_id = v_funnel_id
        ORDER BY order_index DESC
        LIMIT 1;
    END IF;

    IF v_stage_id IS NULL THEN
        RAISE NOTICE 'Nenhuma etapa encontrada para o funil. Pulando migração.';
        RETURN;
    END IF;

    RAISE NOTICE 'Etapa encontrada: % (order: %)', v_stage_id, v_stage_order;

    -- Configuração de blocos modulares para a etapa de resultado
    v_blocks_config := jsonb_build_object(
        'blocks', jsonb_build_array(
            -- 1. Header com logo
            jsonb_build_object(
                'id', 'block-header-1',
                'type', 'header',
                'order', 0,
                'content', jsonb_build_object(
                    'logoUrl', 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    'showProgress', false,
                    'backgroundColor', 'transparent'
                )
            ),
            -- 2. Título do resultado
            jsonb_build_object(
                'id', 'block-heading-result',
                'type', 'heading',
                'order', 1,
                'content', jsonb_build_object(
                    'text', '{{userName}}, seu estilo predominante é:',
                    'level', 'h1',
                    'textAlign', 'center',
                    'textColor', '#432818',
                    'fontFamily', 'playfair'
                )
            ),
            -- 3. Bloco de Resultado do Estilo
            jsonb_build_object(
                'id', 'block-style-result',
                'type', 'styleResult',
                'order', 2,
                'content', jsonb_build_object(
                    'showImage', true,
                    'showPercentage', true,
                    'showDescription', true,
                    'imagePosition', 'left'
                )
            ),
            -- 4. Estilos secundários
            jsonb_build_object(
                'id', 'block-secondary-styles',
                'type', 'secondaryStyles',
                'order', 3,
                'content', jsonb_build_object(
                    'title', 'Seus estilos complementares',
                    'showPercentages', true,
                    'maxStyles', 3
                )
            ),
            -- 5. Divisor
            jsonb_build_object(
                'id', 'block-divider-1',
                'type', 'divider',
                'order', 4,
                'content', jsonb_build_object(
                    'style', 'gradient',
                    'color', '#B89B7A'
                )
            ),
            -- 6. Hook Personalizado
            jsonb_build_object(
                'id', 'block-personalized-hook',
                'type', 'personalizedHook',
                'order', 5,
                'content', jsonb_build_object(
                    'title', 'O que isso significa para você?',
                    'description', 'Seu estilo revela muito sobre sua personalidade e como você se apresenta ao mundo. Mas conhecer seu estilo é apenas o primeiro passo...'
                )
            ),
            -- 7. Âncora de preço
            jsonb_build_object(
                'id', 'block-price-anchor',
                'type', 'priceAnchor',
                'order', 6,
                'content', jsonb_build_object(
                    'title', 'Valor real de tudo que você recebe:',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', 'pa-1', 'label', 'Guia Completo de Estilo', 'originalPrice', 297),
                        jsonb_build_object('id', 'pa-2', 'label', 'Paleta de Cores Personalizada', 'originalPrice', 97),
                        jsonb_build_object('id', 'pa-3', 'label', 'Checklist de Peças Essenciais', 'originalPrice', 47),
                        jsonb_build_object('id', 'pa-4', 'label', 'E-book de Combinações', 'originalPrice', 67)
                    ),
                    'totalLabel', 'Valor total:',
                    'currentPriceLabel', 'Hoje por apenas:',
                    'currentPrice', 97,
                    'installments', 12,
                    'installmentValue', 9.7,
                    'currency', 'R$'
                )
            ),
            -- 8. Lista de benefícios
            jsonb_build_object(
                'id', 'block-benefits',
                'type', 'benefitsList',
                'order', 7,
                'content', jsonb_build_object(
                    'title', 'O que você vai receber:',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', 'b-1', 'title', 'Guia completo do seu estilo', 'description', 'Com exemplos práticos e visuais'),
                        jsonb_build_object('id', 'b-2', 'title', 'Paleta de cores ideal', 'description', 'Cores que valorizam seu tom de pele'),
                        jsonb_build_object('id', 'b-3', 'title', 'Lista de peças essenciais', 'description', 'Itens que não podem faltar no seu guarda-roupa'),
                        jsonb_build_object('id', 'b-4', 'title', 'Dicas de combinação', 'description', 'Como montar looks incríveis')
                    ),
                    'checkColor', '#22C55E'
                )
            ),
            -- 9. CTA principal
            jsonb_build_object(
                'id', 'block-cta-main',
                'type', 'ctaOffer',
                'order', 8,
                'content', jsonb_build_object(
                    'buttonText', 'QUERO MEU GUIA AGORA',
                    'buttonUrl', 'https://pay.hotmart.com/W98977034C?checkoutMode=10',
                    'price', 'R$ 97,00',
                    'installments', 'ou 12x de R$ 9,70',
                    'backgroundColor', '#22C55E',
                    'textColor', '#FFFFFF',
                    'showArrow', true
                )
            ),
            -- 10. Garantia
            jsonb_build_object(
                'id', 'block-guarantee',
                'type', 'guarantee',
                'order', 9,
                'content', jsonb_build_object(
                    'title', 'Garantia Incondicional de 7 Dias',
                    'description', 'Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.',
                    'days', 7,
                    'badgeColor', '#22C55E'
                )
            ),
            -- 11. Depoimentos
            jsonb_build_object(
                'id', 'block-testimonials',
                'type', 'testimonials',
                'order', 10,
                'content', jsonb_build_object(
                    'title', 'O que dizem nossas alunas:',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', 't-1', 'name', 'Ana Paula', 'role', 'Empresária', 'text', 'O guia mudou completamente minha forma de me vestir. Agora sei exatamente o que comprar!', 'rating', 5),
                        jsonb_build_object('id', 't-2', 'name', 'Carla Santos', 'role', 'Advogada', 'text', 'Finalmente entendi porque algumas roupas me valorizavam e outras não. Vale muito a pena!', 'rating', 5),
                        jsonb_build_object('id', 't-3', 'name', 'Julia Mendes', 'role', 'Designer', 'text', 'Super prático e didático. As dicas são fáceis de aplicar no dia a dia.', 'rating', 5)
                    ),
                    'layout', 'carousel'
                )
            ),
            -- 12. Compra segura
            jsonb_build_object(
                'id', 'block-secure',
                'type', 'securePurchase',
                'order', 11,
                'content', jsonb_build_object(
                    'title', 'Compra 100% Segura',
                    'badges', jsonb_build_array('ssl', 'hotmart', 'guarantee')
                )
            )
        ),
        'canvasBackgroundColor', '#FAF9F7',
        'redirectToResult', false
    );

    -- Atualizar a etapa com os blocos modulares
    UPDATE funnel_stages
    SET config = v_blocks_config,
        type = 'result',
        updated_at = NOW()
    WHERE id = v_stage_id;

    RAISE NOTICE 'Etapa % atualizada com blocos modulares!', v_stage_id;
    RAISE NOTICE 'Total de blocos: 12';

END $$;

-- Verificar a atualização
SELECT 
    fs.id,
    fs.title,
    fs.type,
    fs.order_index,
    jsonb_array_length(fs.config->'blocks') as num_blocks
FROM funnel_stages fs
JOIN funnels f ON fs.funnel_id = f.id
WHERE f.name ILIKE '%Quiz de Estilo Pessoal%'
   OR f.slug ILIKE '%quiz%'
ORDER BY fs.order_index;
