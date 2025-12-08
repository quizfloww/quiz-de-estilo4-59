import { StageOption, PublicFunnel } from "@/hooks/usePublicFunnel";

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
  styleCategories: PublicFunnel["style_categories"]
): QuizResult => {
  // Count points per style category
  const pointsByCategory: Record<string, number> = {};

  // Initialize all categories with 0 points
  styleCategories?.forEach((cat) => {
    pointsByCategory[cat.id] = 0;
  });

  // Sum up points from selected options
  Object.values(answers)
    .flat()
    .forEach((optionId) => {
      const option = allOptions.find((opt) => opt.id === optionId);
      if (option?.style_category) {
        const points = option.points || 1;
        pointsByCategory[option.style_category] =
          (pointsByCategory[option.style_category] || 0) + points;
      }
    });

  // Calculate total points
  const totalPoints = Object.values(pointsByCategory).reduce(
    (sum, p) => sum + p,
    0
  );

  // Create results array with percentages
  const allStyles: StyleResult[] = Object.entries(pointsByCategory)
    .map(([categoryId, points]) => {
      const category = styleCategories?.find((c) => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || categoryId,
        points,
        percentage:
          totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0,
      };
    })
    .sort((a, b) => b.points - a.points);

  // Primary style is the one with most points
  const primaryStyle = allStyles[0] || {
    categoryId: "",
    categoryName: "Não definido",
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
// ResultPage expects: { primaryStyle: { category, score, percentage }, secondaryStyles: Array<{ category, score, percentage }> }
export const mapToLegacyResult = (
  result: QuizResult,
  styleCategories: PublicFunnel["style_categories"]
) => {
  // Category map supports: lowercase IDs, Portuguese IDs, and accented names
  const categoryMap: Record<string, string> = {
    // Lowercase IDs (legacy)
    natural: "Natural",
    classico: "Clássico",
    contemporaneo: "Contemporâneo",
    elegante: "Elegante",
    romantico: "Romântico",
    sexy: "Sexy",
    dramatico: "Dramático",
    criativo: "Criativo",
    // Portuguese IDs (matching DEFAULT_STYLE_CATEGORIES)
    Natural: "Natural",
    Clássico: "Clássico",
    Contemporâneo: "Contemporâneo",
    Elegante: "Elegante",
    Romântico: "Romântico",
    Sexy: "Sexy",
    Dramático: "Dramático",
    Criativo: "Criativo",
  };

  // Helper to map a StyleResult to the legacy format expected by ResultPage
  const mapStyleToLegacy = (style: StyleResult) => {
    // Try category map first, then use categoryName directly if it matches styleConfig keys
    const mappedCategory = categoryMap[style.categoryId];
    const categoryName =
      mappedCategory || categoryMap[style.categoryName] || style.categoryName;
    return {
      category: categoryName,
      score: style.points,
      percentage: style.percentage,
    };
  };

  // Map primary style to legacy format
  const primaryStyle = mapStyleToLegacy(result.primaryStyle);

  // Map secondary styles to legacy format (array)
  const secondaryStyles = result.secondaryStyles.map(mapStyleToLegacy);

  // Also keep the first secondary style for backwards compatibility
  const secondaryStyle = secondaryStyles[0] || null;

  return {
    primaryStyle, // { category: "Natural", score: 10, percentage: 45 }
    secondaryStyles, // Array of { category, score, percentage }
    secondaryStyle, // Legacy single secondary (backwards compat)
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
