import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  usePublicFunnel,
  useSaveFunnelResponse,
  FunnelStage,
} from "@/hooks/usePublicFunnel";
import {
  calculateDynamicResults,
  mapToLegacyResult,
} from "@/utils/dynamicQuizCalculator";
import { DynamicQuizHeader } from "@/components/dynamic-quiz/DynamicQuizHeader";
import { DynamicIntro } from "@/components/dynamic-quiz/DynamicIntro";
import { DynamicQuestion } from "@/components/dynamic-quiz/DynamicQuestion";
import { DynamicTransition } from "@/components/dynamic-quiz/DynamicTransition";
import { DynamicResult } from "@/components/dynamic-quiz/DynamicResult";
import { DynamicOffer } from "@/components/dynamic-quiz/DynamicOffer";
import { DynamicThankyou } from "@/components/dynamic-quiz/DynamicThankyou";
import { DynamicStageRenderer } from "@/components/dynamic-quiz/DynamicStageRenderer";
import { AnimatedStageWrapper } from "@/components/dynamic-quiz/AnimatedStageWrapper";
import {
  EnchantedBackground,
  MorphingProgress,
} from "@/components/effects/EnchantedEffects";
import { Loader2 } from "lucide-react";
import {
  trackGA4QuizStart,
  trackGA4QuizQuestion,
  trackGA4QuizComplete,
  trackGA4ResultView,
} from "@/utils/googleAnalytics";

const DynamicQuizPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: funnel, isLoading, error } = usePublicFunnel(slug);
  const saveResponse = useSaveFunnelResponse();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<
    "forward" | "backward"
  >("forward");

  // Quiz result state for unified flow (no redirect)
  const [quizResult, setQuizResult] = useState<{
    primaryStyle: {
      category: string;
      score: number;
      percentage: number;
    } | null;
    secondaryStyles: Array<{
      category: string;
      score: number;
      percentage: number;
    }>;
  } | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Analytics tracking refs
  const quizStartTracked = useRef(false);
  const answersTracked = useRef<Set<string>>(new Set());
  const milestonesTracked = useRef<Set<number>>(new Set());

  // Get enabled stages only - memoized to prevent infinite loops
  const stages = useMemo(() => funnel?.stages || [], [funnel?.stages]);
  const currentStage = stages[currentStageIndex];
  const globalConfig = useMemo(
    () => funnel?.global_config || {},
    [funnel?.global_config]
  );

  // Progress persistence key
  const progressKey = slug ? `quiz-progress-${slug}` : null;

  // Restore progress from localStorage
  useEffect(() => {
    if (!progressKey || !funnel) return;

    const saved = localStorage.getItem(progressKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Check if not expired (24h)
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          // Only restore if same funnel
          if (data.funnelId === funnel.id) {
            setCurrentStageIndex(data.currentStageIndex || 0);
            setUserName(data.userName || "");
            setAnswers(data.answers || {});
          }
        } else {
          // Expired - clear
          localStorage.removeItem(progressKey);
        }
      } catch {
        localStorage.removeItem(progressKey);
      }
    }
  }, [progressKey, funnel]);

  // Save progress on each change
  useEffect(() => {
    if (!progressKey || !funnel) return;

    localStorage.setItem(
      progressKey,
      JSON.stringify({
        funnelId: funnel.id,
        currentStageIndex,
        userName,
        answers,
        timestamp: Date.now(),
      })
    );
  }, [progressKey, currentStageIndex, userName, answers, funnel]);

  const handleIntroComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);

    // Track quiz start
    if (!quizStartTracked.current) {
      trackGA4QuizStart(funnel?.title || slug, {
        funnel_id: funnel?.id,
        funnel_slug: slug,
        user_name: name,
      });
      quizStartTracked.current = true;
    }

    goToNextStage();
  };

  const handleAnswerChange = (stageId: string, selectedOptions: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [stageId]: selectedOptions,
    }));

    // Track answer (only once per question to avoid spam)
    if (!answersTracked.current.has(stageId) && selectedOptions.length > 0) {
      const questionIndex = stages.findIndex((s) => s.id === stageId);
      trackGA4QuizQuestion(questionIndex + 1, stages[questionIndex]?.title, {
        funnel_id: funnel?.id,
        funnel_slug: slug,
        answer: selectedOptions.join(", "),
      });
      answersTracked.current.add(stageId);
    }
  };

  const goToPreviousStage = useCallback(() => {
    setNavigationDirection("backward");
    if (currentStageIndex > 0) {
      setCurrentStageIndex((prev) => prev - 1);
    }
  }, [currentStageIndex]);

  const handleQuizComplete = useCallback(async () => {
    if (!funnel) return;

    setIsCalculating(true);

    try {
      // Get all options from all stages
      const allOptions = stages.flatMap((stage) => stage.options);

      // Calculate results
      const result = calculateDynamicResults(
        answers,
        allOptions,
        funnel.style_categories
      );

      // Map to legacy format for result page
      const legacyResult = mapToLegacyResult(result, funnel.style_categories);

      // Track quiz completion
      trackGA4QuizComplete(
        funnel.title || slug,
        legacyResult.primaryStyle?.category,
        legacyResult.primaryStyle?.percentage,
        {
          funnel_id: funnel.id,
          funnel_slug: slug,
          primary_style: legacyResult.primaryStyle?.category,
          secondary_style: legacyResult.secondaryStyle?.category,
          user_name: userName,
        }
      );

      // Track result view
      if (legacyResult.primaryStyle) {
        trackGA4ResultView(legacyResult.primaryStyle.category, {
          funnel_id: funnel.id,
          funnel_slug: slug,
          secondary_style: legacyResult.secondaryStyle?.category,
          user_name: userName,
        });
      }

      // Save to database
      await saveResponse.mutateAsync({
        funnel_id: funnel.id,
        participant_name: userName,
        participant_email: null,
        answers,
        results: {
          ...result,
          ...legacyResult,
        },
      });

      // Store in localStorage for backward compatibility
      localStorage.setItem(
        "quizResult",
        JSON.stringify({
          primaryStyle: legacyResult.primaryStyle,
          secondaryStyles: legacyResult.secondaryStyles,
          scores: legacyResult.scores,
          userName,
          totalSelections: result.totalPoints,
        })
      );

      // Clear progress after completion
      if (progressKey) {
        localStorage.removeItem(progressKey);
      }

      // Store result in state for unified flow (no redirect)
      setQuizResult({
        primaryStyle: legacyResult.primaryStyle,
        secondaryStyles: legacyResult.secondaryStyles || [],
      });
      setQuizCompleted(true);

      // Check if funnel has result/offer stages - if so, continue to them
      const hasResultOrOfferStages = stages.some(
        (s) =>
          s.type === "result" ||
          s.type === "offer" ||
          s.type === "thankyou" ||
          s.type === "upsell"
      );

      if (hasResultOrOfferStages) {
        // Find the first result/offer/thankyou stage and navigate to it
        const resultStageIndex = stages.findIndex(
          (s) =>
            s.type === "result" ||
            s.type === "offer" ||
            s.type === "thankyou" ||
            s.type === "upsell"
        );
        if (resultStageIndex >= 0) {
          setTimeout(() => {
            setIsCalculating(false);
            setCurrentStageIndex(resultStageIndex);
          }, 1500);
          return;
        }
      }

      // Fallback: Check if config specifies external redirect
      const resultStage = stages.find((s) => s.type === "result");
      const resultUrl = (resultStage?.config as Record<string, unknown>)
        ?.resultUrl as string;

      if (resultUrl && resultUrl.startsWith("/")) {
        // Only redirect if explicitly configured
        setTimeout(() => {
          navigate(resultUrl);
        }, 1500);
      } else {
        // Stay on current page with result shown
        setTimeout(() => {
          setIsCalculating(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Error saving quiz response:", err);
      setIsCalculating(false);
      // Still mark as completed to show results
      setQuizCompleted(true);
    }
  }, [
    funnel,
    stages,
    answers,
    userName,
    saveResponse,
    progressKey,
    navigate,
    slug,
  ]);

  const goToNextStage = useCallback(() => {
    setNavigationDirection("forward");

    // Track progress milestones
    if (stages.length > 0) {
      const nextIndex = currentStageIndex + 1;
      const progressPercent = Math.round((nextIndex / stages.length) * 100);

      // Track 25%, 50%, 75% milestones
      const milestones = [25, 50, 75];
      for (const milestone of milestones) {
        if (
          progressPercent >= milestone &&
          !milestonesTracked.current.has(milestone)
        ) {
          trackGA4QuizQuestion(0, `Progress: ${milestone}% completed`, {
            funnel_id: funnel?.id,
            funnel_slug: slug,
          });
          milestonesTracked.current.add(milestone);
        }
      }
    }

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    } else {
      // Quiz completed - calculate results
      handleQuizComplete();
    }
  }, [currentStageIndex, stages.length, handleQuizComplete, funnel?.id, slug]);

  const renderStage = (stage: FunnelStage) => {
    const stageConfig = stage.config || {};
    const showLogo = stageConfig.showLogo !== false && globalConfig.logoUrl;
    const showProgress = stageConfig.showProgress !== false;
    const allowReturn = stageConfig.allowReturn !== false;

    // Check if stage has blocks configured (from editor)
    const blocksArray = (stageConfig as Record<string, unknown>).blocks;
    const hasBlocks = Array.isArray(blocksArray) && blocksArray.length > 0;

    // Use DynamicStageRenderer for stages with modular blocks configured
    // This allows the editor to fully control the layout with reorderable blocks
    const useBlockRenderer =
      hasBlocks &&
      ["result", "offer", "upsell", "thankyou", "page"].includes(stage.type);

    if (useBlockRenderer) {
      // For result stage, ensure quiz is completed first
      if (stage.type === "result" && !quizCompleted) {
        handleQuizComplete();
        return null;
      }

      return (
        <DynamicStageRenderer
          stage={stage}
          stages={stages}
          stageIndex={currentStageIndex}
          globalConfig={globalConfig}
          styleCategories={funnel?.style_categories}
          userName={userName}
          quizResult={quizResult}
          onContinue={goToNextStage}
          onPrevious={goToPreviousStage}
          onOptionSelect={(optionId) => {
            const currentSelected = answers[stage.id] || [];
            const newSelected = currentSelected.includes(optionId)
              ? currentSelected.filter((id) => id !== optionId)
              : [...currentSelected, optionId];
            handleAnswerChange(stage.id, newSelected);
          }}
          selectedOptions={answers[stage.id] || []}
        />
      );
    }

    switch (stage.type) {
      case "intro":
        return (
          <DynamicIntro
            stage={stage}
            globalConfig={globalConfig}
            onContinue={handleIntroComplete}
          />
        );

      case "question":
      case "strategic":
        return (
          <DynamicQuestion
            stage={stage}
            currentAnswers={answers[stage.id] || []}
            onAnswer={(selected) => handleAnswerChange(stage.id, selected)}
            onContinue={goToNextStage}
          />
        );

      case "transition":
        return <DynamicTransition stage={stage} onContinue={goToNextStage} />;

      case "result":
        // If quiz not completed yet, trigger completion
        if (!quizCompleted) {
          handleQuizComplete();
          return null;
        }
        // Fallback: Render default result component if no blocks configured
        return (
          <DynamicResult
            stage={stage}
            primaryStyle={quizResult?.primaryStyle || null}
            secondaryStyles={quizResult?.secondaryStyles || []}
            userName={userName}
            onContinue={goToNextStage}
            styleCategories={funnel?.style_categories}
          />
        );

      case "offer":
      case "upsell":
        // Fallback: Render default offer component if no blocks configured
        return (
          <DynamicOffer
            stage={stage}
            userName={userName}
            primaryStyleCategory={quizResult?.primaryStyle?.category}
            onContinue={goToNextStage}
          />
        );

      case "thankyou":
        // Fallback: Render default thankyou component if no blocks configured
        return (
          <DynamicThankyou
            stage={stage}
            userName={userName}
            primaryStyleCategory={quizResult?.primaryStyle?.category}
            onContinue={() => {
              // Reset quiz or go to home
              window.location.href = "/";
            }}
          />
        );

      case "page":
        // Custom page - use DynamicStageRenderer if has blocks, else transition
        return <DynamicTransition stage={stage} onContinue={goToNextStage} />;

      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error or not found
  if (error || !funnel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4">
        <h1 className="text-2xl font-bold text-foreground">
          Quiz não encontrado
        </h1>
        <p className="text-muted-foreground text-center">
          O quiz que você está procurando não existe ou não está publicado.
        </p>
      </div>
    );
  }

  // Calculating results
  if (isCalculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">
          Calculando seu resultado...
        </p>
      </div>
    );
  }

  // No stages configured
  if (!currentStage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4">
        <h1 className="text-2xl font-bold text-foreground">Quiz vazio</h1>
        <p className="text-muted-foreground text-center">
          Este quiz ainda não possui etapas configuradas.
        </p>
      </div>
    );
  }

  const stageConfig = (currentStage.config || {}) as Record<string, unknown>;

  // Configurações de efeitos do globalConfig
  const effectsConfig = globalConfig.effects || {};
  const enableFloatingEmojis = effectsConfig.enableFloatingEmojis ?? false;
  const effectsIntensity = effectsConfig.effectsIntensity ?? 0.5;
  const progressStyle = effectsConfig.progressStyle ?? "simple";
  const showProgressShimmer = effectsConfig.showProgressShimmer ?? false;
  const progressColors = effectsConfig.progressColors;

  // Determinar fase atual para os efeitos
  const isIntro = currentStage.type === "intro";
  const isStrategic = currentStage.type === "strategic";
  const effectPhase = isIntro ? "intro" : isStrategic ? "strategic" : "quiz";
  const progressPhase = isStrategic ? "strategic" : "normal";

  // Progresso em porcentagem
  const progressPercentage =
    stages.length > 0 ? ((currentStageIndex + 1) / stages.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Efeitos de Fundo Configuráveis */}
      {enableFloatingEmojis && !isIntro && (
        <EnchantedBackground
          phase={effectPhase}
          intensity={effectsIntensity}
          customEmojis={{
            intro: effectsConfig.customIntroEmojis,
            quiz: effectsConfig.customQuizEmojis,
            strategic: effectsConfig.customStrategicEmojis,
            results: effectsConfig.customResultEmojis,
          }}
          enabled={enableFloatingEmojis}
        />
      )}

      <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 md:p-5 pb-10">
        <div className="grid gap-4">
          {/* Barra de Progresso Morphing (se não for intro) */}
          {!isIntro && progressStyle !== "simple" && (
            <MorphingProgress
              progress={progressPercentage}
              phase={progressPhase}
              showShimmer={showProgressShimmer}
              style={progressStyle}
              customColors={progressColors}
            />
          )}

          <DynamicQuizHeader
            logoUrl={globalConfig.logoUrl}
            showLogo={stageConfig.showLogo !== false}
            showProgress={stageConfig.showProgress !== false}
            allowReturn={stageConfig.allowReturn !== false}
            currentStep={currentStageIndex}
            totalSteps={stages.length}
            onBack={goToPreviousStage}
          />
        </div>

        <div className="main-content w-full relative mx-auto max-w-2xl h-full py-8">
          <AnimatedStageWrapper
            stageKey={currentStage.id}
            direction={navigationDirection}
          >
            {renderStage(currentStage)}
          </AnimatedStageWrapper>
        </div>

        <div className="pt-10 md:pt-24" />
      </div>
    </div>
  );
};

export default DynamicQuizPage;
