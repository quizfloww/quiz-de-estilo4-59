/**
 * Teste específico para verificar renderização de imagens nas opções das questões 4-9
 *
 * Execute com: npx vitest run src/tests/quiz-options-images.test.ts
 */

import { describe, it, expect, vi } from "vitest";

// Mock do Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() =>
              Promise.resolve({ data: mockFunnel, error: null })
            ),
          })),
          order: vi.fn(() =>
            Promise.resolve({ data: mockStages, error: null })
          ),
        })),
        in: vi.fn(() => ({
          order: vi.fn(() =>
            Promise.resolve({ data: mockOptions, error: null })
          ),
        })),
      })),
    })),
  },
}));

// Dados de mock para o funil "quiz"
const mockFunnel = {
  id: "quiz-funnel-id",
  name: "Quiz de Estilo",
  slug: "quiz",
  status: "published",
  global_config: {},
  style_categories: [],
};

// Stages 4-9 são questões (assumindo order_index 3-8)
const mockStages = [
  {
    id: "stage-1",
    funnel_id: "quiz-funnel-id",
    type: "intro",
    title: "Introdução",
    order_index: 0,
    is_enabled: true,
    config: {},
  },
  {
    id: "stage-2",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 1",
    order_index: 1,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-3",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 2",
    order_index: 2,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-4",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 4",
    order_index: 3,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-5",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 5",
    order_index: 4,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-6",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 6",
    order_index: 5,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-7",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 7",
    order_index: 6,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-8",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 8",
    order_index: 7,
    is_enabled: true,
    config: { displayType: "both" },
  },
  {
    id: "stage-9",
    funnel_id: "quiz-funnel-id",
    type: "question",
    title: "Questão 9",
    order_index: 8,
    is_enabled: true,
    config: { displayType: "both" },
  },
];

// Opções com e sem imagens para teste
const mockOptions = [
  // Questão 4 - opções COM imagem (image_url no banco)
  {
    id: "opt-4-1",
    stage_id: "stage-4",
    text: "Opção 1",
    image_url: "https://example.com/img1.jpg",
    style_category: "elegante",
    points: 1,
    order_index: 0,
  },
  {
    id: "opt-4-2",
    stage_id: "stage-4",
    text: "Opção 2",
    image_url: "https://example.com/img2.jpg",
    style_category: "casual",
    points: 1,
    order_index: 1,
  },

  // Questão 5 - opções SEM image_url no banco (deveria vir do config)
  {
    id: "opt-5-1",
    stage_id: "stage-5",
    text: "Opção A",
    image_url: null,
    style_category: "elegante",
    points: 1,
    order_index: 0,
  },
  {
    id: "opt-5-2",
    stage_id: "stage-5",
    text: "Opção B",
    image_url: null,
    style_category: "casual",
    points: 1,
    order_index: 1,
  },

  // Questão 6 - opções com image_url vazia
  {
    id: "opt-6-1",
    stage_id: "stage-6",
    text: "Opção X",
    image_url: "",
    style_category: "elegante",
    points: 1,
    order_index: 0,
  },
  {
    id: "opt-6-2",
    stage_id: "stage-6",
    text: "Opção Y",
    image_url: "",
    style_category: "casual",
    points: 1,
    order_index: 1,
  },
];

describe("Quiz Options Images - Questões 4-9", () => {
  describe("Diagnóstico de dados", () => {
    it("deve verificar se stage_options tem image_url preenchido", () => {
      const questao4Options = mockOptions.filter(
        (o) => o.stage_id === "stage-4"
      );
      const questao5Options = mockOptions.filter(
        (o) => o.stage_id === "stage-5"
      );
      const questao6Options = mockOptions.filter(
        (o) => o.stage_id === "stage-6"
      );

      // Questão 4 - deve ter imagens
      expect(
        questao4Options.every((o) => o.image_url && o.image_url.length > 0)
      ).toBe(true);
      console.log(
        "Questão 4 - Opções com imagem:",
        questao4Options.map((o) => ({ text: o.text, image_url: o.image_url }))
      );

      // Questão 5 - imagens nulas
      expect(questao5Options.every((o) => o.image_url === null)).toBe(true);
      console.log(
        "Questão 5 - Opções sem imagem:",
        questao5Options.map((o) => ({ text: o.text, image_url: o.image_url }))
      );

      // Questão 6 - imagens vazias
      expect(questao6Options.every((o) => o.image_url === "")).toBe(true);
      console.log(
        "Questão 6 - Opções com imagem vazia:",
        questao6Options.map((o) => ({ text: o.text, image_url: o.image_url }))
      );
    });
  });

  describe("Lógica de enriquecimento de opções", () => {
    it("deve enriquecer opções sem image_url com dados do config", () => {
      const stageOptions = [
        {
          id: "opt-1",
          text: "Opção 1",
          image_url: null,
          stage_id: "stage-5",
          style_category: null,
          points: 1,
          order_index: 0,
        },
      ];

      const configOptions = [
        {
          id: "opt-1",
          text: "Opção 1",
          imageUrl: "https://config.com/img1.jpg",
        },
      ];

      // Simula a lógica do DynamicQuestion
      const enrichedOptions = stageOptions.map((opt) => {
        if (opt.image_url) return opt;

        const configOpt = configOptions.find(
          (co: any) => co.id === opt.id || co.text === opt.text
        );

        if (configOpt?.imageUrl || configOpt?.image_url) {
          return {
            ...opt,
            image_url: configOpt.imageUrl || configOpt.image_url,
          };
        }

        return opt;
      });

      expect(enrichedOptions[0].image_url).toBe("https://config.com/img1.jpg");
    });

    it("deve manter image_url original se já existe no banco", () => {
      const stageOptions = [
        {
          id: "opt-1",
          text: "Opção 1",
          image_url: "https://banco.com/original.jpg",
          stage_id: "stage-4",
          style_category: null,
          points: 1,
          order_index: 0,
        },
      ];

      const configOptions = [
        {
          id: "opt-1",
          text: "Opção 1",
          imageUrl: "https://config.com/override.jpg",
        },
      ];

      const enrichedOptions = stageOptions.map((opt) => {
        if (opt.image_url) return opt;

        const configOpt = configOptions.find(
          (co: any) => co.id === opt.id || co.text === opt.text
        );

        if (configOpt?.imageUrl) {
          return { ...opt, image_url: configOpt.imageUrl };
        }

        return opt;
      });

      // Deve manter a URL original do banco
      expect(enrichedOptions[0].image_url).toBe(
        "https://banco.com/original.jpg"
      );
    });
  });

  describe("QuizOption - renderização de imagem", () => {
    it("deve determinar showImage corretamente", () => {
      const testCases = [
        {
          displayType: "text",
          imageUrl: "https://img.com/1.jpg",
          expectedShowImage: false,
        },
        {
          displayType: "image",
          imageUrl: "https://img.com/1.jpg",
          expectedShowImage: true,
        },
        {
          displayType: "both",
          imageUrl: "https://img.com/1.jpg",
          expectedShowImage: true,
        },
        { displayType: "image", imageUrl: undefined, expectedShowImage: false },
        { displayType: "both", imageUrl: "", expectedShowImage: false },
        { displayType: "both", imageUrl: null, expectedShowImage: false },
      ];

      testCases.forEach(({ displayType, imageUrl, expectedShowImage }) => {
        // Simula a lógica do QuizOption
        const showImage = displayType !== "text" && !!imageUrl;

        expect(showImage).toBe(expectedShowImage);
        console.log(
          `displayType: ${displayType}, imageUrl: ${
            imageUrl || "vazio"
          } => showImage: ${showImage}`
        );
      });
    });
  });

  describe("DynamicQuizOption - conversão de tipos", () => {
    it("deve converter StageOption para QuizOptionItem corretamente", () => {
      const stageOption = {
        id: "opt-1",
        stage_id: "stage-4",
        text: "Opção com imagem",
        image_url: "https://example.com/img.jpg",
        style_category: "elegante",
        points: 1,
        order_index: 0,
      };

      // Simula a lógica do DynamicQuizOption
      const optionAny = stageOption as any;
      const quizOption = {
        id: stageOption.id,
        text: stageOption.text,
        imageUrl: stageOption.image_url || optionAny.imageUrl || undefined,
        styleCategory:
          stageOption.style_category || optionAny.styleCategory || undefined,
        points: stageOption.points,
      };

      expect(quizOption.imageUrl).toBe("https://example.com/img.jpg");
    });

    it("deve lidar com opções sem image_url", () => {
      const stageOption = {
        id: "opt-2",
        stage_id: "stage-5",
        text: "Opção sem imagem",
        image_url: null,
        style_category: "casual",
        points: 1,
        order_index: 0,
      };

      const optionAny = stageOption as any;
      const quizOption = {
        id: stageOption.id,
        text: stageOption.text,
        imageUrl: stageOption.image_url || optionAny.imageUrl || undefined,
        styleCategory:
          stageOption.style_category || optionAny.styleCategory || undefined,
        points: stageOption.points,
      };

      // Deve ser undefined, não null
      expect(quizOption.imageUrl).toBeUndefined();
    });
  });
});

/**
 * DIAGNÓSTICO MANUAL:
 *
 * Para investigar o problema real, execute no console do navegador quando estiver no quiz:
 *
 * 1. Verificar dados do stage atual:
 *    console.log('Stage atual:', window.__QUIZ_CURRENT_STAGE__);
 *
 * 2. Verificar opções:
 *    console.log('Opções:', window.__QUIZ_CURRENT_STAGE__?.options);
 *
 * 3. Verificar config:
 *    console.log('Config:', window.__QUIZ_CURRENT_STAGE__?.config);
 *
 * 4. Query direta no Supabase (via SQL Editor):
 *    SELECT so.*, fs.title as stage_title, fs.order_index as stage_order
 *    FROM stage_options so
 *    JOIN funnel_stages fs ON so.stage_id = fs.id
 *    JOIN funnels f ON fs.funnel_id = f.id
 *    WHERE f.slug = 'quiz'
 *    AND fs.order_index BETWEEN 3 AND 8
 *    ORDER BY fs.order_index, so.order_index;
 */
