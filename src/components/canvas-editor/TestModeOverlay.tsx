import React, { useEffect } from "react";
import { FunnelStage } from "@/hooks/useFunnelStages";
import { CanvasBlock } from "@/types/canvasBlocks";
import { FunnelConfig } from "@/types/funnelConfig";
import { useTestMode } from "@/hooks/useTestMode";
import { InteractiveBlock } from "./InteractiveBlock";
import { TestResultView } from "./TestResultView";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestModeOverlayProps {
  stages: FunnelStage[];
  stageBlocks: Record<string, CanvasBlock[]>;
  globalConfig: FunnelConfig | null;
  onExit: () => void;
}

export const TestModeOverlay: React.FC<TestModeOverlayProps> = ({
  stages,
  stageBlocks,
  globalConfig,
  onExit,
}) => {
  const {
    currentStageIndex,
    currentStage,
    currentBlocks,
    answers,
    currentAnswers,
    userName,
    setUserName,
    isComplete,
    result,
    canProceed,
    shouldAutoAdvance,
    progress,
    handleAnswer,
    goToNextStage,
    goToPreviousStage,
    reset,
    totalStages,
  } = useTestMode({ stages, stageBlocks });

  // Auto-advance effect
  useEffect(() => {
    if (shouldAutoAdvance) {
      const timer = setTimeout(() => {
        goToNextStage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoAdvance, goToNextStage]);

  // Background from global config
  const bgStyle = globalConfig?.branding?.backgroundColor
    ? { backgroundColor: globalConfig.branding.backgroundColor }
    : { backgroundColor: "#FAF9F7" };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={bgStyle}
      data-testid="test-mode-overlay"
    >
      {/* Header */}
      <div className="h-14 border-b bg-background/80 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            data-testid="test-mode-close"
          >
            <X className="h-5 w-5" />
          </Button>
          <span className="font-medium">Modo de Teste</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Etapa {currentStageIndex + 1} de {totalStages}
          </span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Mobile Preview Container */}
        <div className="w-full max-w-[420px] h-full max-h-[800px] bg-background rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
          {isComplete && result ? (
            <ScrollArea className="flex-1">
              <TestResultView
                result={result}
                userName={userName}
                onReset={reset}
                onExit={onExit}
              />
            </ScrollArea>
          ) : currentStage ? (
            <>
              {/* Back button */}
              {currentStageIndex > 0 && (
                <div className="p-3 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousStage}
                    className="gap-2"
                    data-testid="test-mode-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              )}

              {/* Stage Content */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {currentBlocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <InteractiveBlock
                        key={block.id}
                        block={block}
                        stageId={currentStage.id}
                        selectedOptions={currentAnswers}
                        userName={userName}
                        progress={progress}
                        onAnswer={(options) =>
                          handleAnswer(currentStage.id, options)
                        }
                        onInputChange={setUserName}
                        onButtonClick={goToNextStage}
                        canProceed={canProceed}
                      />
                    ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Nenhuma etapa disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
