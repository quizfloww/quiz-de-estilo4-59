import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DynamicQuizHeaderProps {
  logoUrl?: string;
  showLogo?: boolean;
  showProgress?: boolean;
  allowReturn?: boolean;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export const DynamicQuizHeader: React.FC<DynamicQuizHeaderProps> = ({
  logoUrl,
  showLogo = true,
  showProgress = true,
  allowReturn = true,
  currentStep,
  totalSteps,
  onBack,
}) => {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-row w-full h-auto justify-center relative">
      {allowReturn && onBack && currentStep > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 hover:bg-primary hover:text-primary-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex flex-col w-full max-w-md justify-start items-center gap-4">
        {showLogo && logoUrl && (
          <img
            width={96}
            height={96}
            className="max-w-24 object-cover"
            alt="Logo"
            src={logoUrl}
          />
        )}
        
        {showProgress && (
          <Progress value={progress} className="w-full h-2" />
        )}
      </div>
    </div>
  );
};
