import { StageOption, PublicFunnel } from '@/hooks/usePublicFunnel';

export interface StyleResult {
  categoryId: string;
  categoryName: string;
  points: number;
  percentage: number;
}

export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  allStyles: StyleResult[];
  totalPoints: number;
}

export const calculateDynamicResults = (
  answers: Record<string, string[]>,
  allOptions: StageOption[],
  styleCategories: PublicFunnel['style_categories']
): QuizResult => {
  // Count points per style category
  const pointsByCategory: Record<string, number> = {};

  // Initialize all categories with 0 points
  styleCategories?.forEach(cat => {
    pointsByCategory[cat.id] = 0;
  });

  // Sum up points from selected options
  Object.values(answers).flat().forEach(optionId => {
    const option = allOptions.find(opt => opt.id === optionId);
    if (option?.style_category) {
      const points = option.points || 1;
      pointsByCategory[option.style_category] = 
        (pointsByCategory[option.style_category] || 0) + points;
    }
  });

  // Calculate total points
  const totalPoints = Object.values(pointsByCategory).reduce((sum, p) => sum + p, 0);

  // Create results array with percentages
  const allStyles: StyleResult[] = Object.entries(pointsByCategory)
    .map(([categoryId, points]) => {
      const category = styleCategories?.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || categoryId,
        points,
        percentage: totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0,
      };
    })
    .sort((a, b) => b.points - a.points);

  // Primary style is the one with most points
  const primaryStyle = allStyles[0] || {
    categoryId: '',
    categoryName: 'Não definido',
    points: 0,
    percentage: 0,
  };

  // Secondary styles are 2nd and 3rd place
  const secondaryStyles = allStyles.slice(1, 3);

  return {
    primaryStyle,
    secondaryStyles,
    allStyles,
    totalPoints,
  };
};

// Map style category IDs to the existing result page format
export const mapToLegacyResult = (result: QuizResult, styleCategories: PublicFunnel['style_categories']) => {
  const categoryMap: Record<string, string> = {
    'natural': 'Natural',
    'classico': 'Clássico',
    'contemporaneo': 'Contemporâneo',
    'elegante': 'Elegante',
    'romantico': 'Romântico',
    'sexy': 'Sexy',
    'dramatico': 'Dramático',
    'criativo': 'Criativo',
  };

  const primaryCategory = styleCategories?.find(c => c.id === result.primaryStyle.categoryId);
  const secondaryCategory = styleCategories?.find(c => c.id === result.secondaryStyles[0]?.categoryId);

  return {
    primaryStyle: categoryMap[result.primaryStyle.categoryId] || result.primaryStyle.categoryName,
    secondaryStyle: result.secondaryStyles[0] 
      ? categoryMap[result.secondaryStyles[0].categoryId] || result.secondaryStyles[0].categoryName 
      : null,
    scores: result.allStyles.reduce((acc, style) => {
      acc[style.categoryId] = style.points;
      return acc;
    }, {} as Record<string, number>),
    percentages: result.allStyles.reduce((acc, style) => {
      acc[style.categoryId] = style.percentage;
      return acc;
    }, {} as Record<string, number>),
  };
};
