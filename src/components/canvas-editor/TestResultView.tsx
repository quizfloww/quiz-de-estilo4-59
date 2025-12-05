import React from 'react';
import { TestResult } from '@/hooks/useTestMode';
import { Button } from '@/components/ui/button';
import { RotateCcw, X, Trophy, Award } from 'lucide-react';

interface TestResultViewProps {
  result: TestResult;
  userName: string;
  onReset: () => void;
  onExit: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  result,
  userName,
  onReset,
  onExit,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="space-y-2">
          <Trophy className="h-16 w-16 mx-auto text-[#b29670]" />
          <h2 className="text-2xl font-bold">
            {userName ? `Parabéns, ${userName}!` : 'Resultado do Teste'}
          </h2>
          <p className="text-muted-foreground">
            Seu estilo predominante é:
          </p>
        </div>

        {/* Primary Style */}
        <div className="bg-gradient-to-br from-[#b29670]/20 to-[#b29670]/5 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-[#b29670]" />
            <span className="text-3xl font-bold text-[#b29670]">
              {result.primaryStyle.name}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <span className="text-4xl font-bold">{result.primaryStyle.percentage}%</span>
              <p className="text-xs text-muted-foreground">Compatibilidade</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold">{result.primaryStyle.points}</span>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </div>
          </div>
        </div>

        {/* Secondary Styles */}
        {result.secondaryStyles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Estilos Secundários
            </h3>
            <div className="grid gap-2">
              {result.secondaryStyles.map((style, index) => (
                <div
                  key={style.id}
                  className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2"
                >
                  <span className="font-medium">{style.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{style.percentage}%</span>
                    <span className="font-semibold">{style.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total de pontos: <span className="font-semibold">{result.totalPoints}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Testar Novamente
          </Button>
          <Button
            onClick={onExit}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Sair do Teste
          </Button>
        </div>
      </div>
    </div>
  );
};
