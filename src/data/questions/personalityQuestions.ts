import { QuizQuestion } from "../../types/quiz";

export const personalityQuestions: QuizQuestion[] = [
  {
    id: "2",
    title: "RESUMA A SUA PERSONALIDADE:",
    type: "text",
    multiSelect: 3,
    options: [
      {
        id: "2a",
        text: "Informal, espontânea, alegre, essencialista.",
        styleCategory: "Natural",
        points: 1,
      },
      {
        id: "2b",
        text: "Conservadora, séria, organizada.",
        styleCategory: "Clássico",
        points: 1,
      },
      {
        id: "2c",
        text: "Informada, ativa, prática.",
        styleCategory: "Contemporâneo",
        points: 1,
      },
      {
        id: "2d",
        text: "Exigente, sofisticada, seletiva.",
        styleCategory: "Elegante",
        points: 1,
      },
      {
        id: "2e",
        text: "Feminina, meiga, delicada, sensível.",
        styleCategory: "Romântico",
        points: 1,
      },
      {
        id: "2f",
        text: "Glamorosa, vaidosa, sensual.",
        styleCategory: "Sexy",
        points: 1,
      },
      {
        id: "2g",
        text: "Cosmopolita, moderna e audaciosa.",
        styleCategory: "Dramático",
        points: 1,
      },
      {
        id: "2h",
        text: "Exótica, aventureira, livre.",
        styleCategory: "Criativo",
        points: 1,
      },
    ],
  },
  {
    id: "4",
    title: "O QUE VOCÊ MAIS VALORIZA EM UMA ROUPA?",
    type: "text",
    multiSelect: 3,
    options: [
      {
        id: "4a",
        text: "Conforto e praticidade acima de tudo.",
        styleCategory: "Natural",
        points: 1,
      },
      {
        id: "4b",
        text: "Qualidade e durabilidade do tecido.",
        styleCategory: "Clássico",
        points: 1,
      },
      {
        id: "4c",
        text: "Versatilidade para várias ocasiões.",
        styleCategory: "Contemporâneo",
        points: 1,
      },
      {
        id: "4d",
        text: "Acabamento impecável e caimento perfeito.",
        styleCategory: "Elegante",
        points: 1,
      },
      {
        id: "4e",
        text: "Detalhes delicados e femininos.",
        styleCategory: "Romântico",
        points: 1,
      },
      {
        id: "4f",
        text: "Modelagem que valorize o corpo.",
        styleCategory: "Sexy",
        points: 1,
      },
      {
        id: "4g",
        text: "Cortes diferenciados e impactantes.",
        styleCategory: "Dramático",
        points: 1,
      },
      {
        id: "4h",
        text: "Originalidade e exclusividade da peça.",
        styleCategory: "Criativo",
        points: 1,
      },
    ],
  },
];
