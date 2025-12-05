import React from 'react';
import { QuizFlowEditor } from '@/components/quiz-flow-editor/QuizFlowEditor';

interface QuizEditorPanelProps {
  isVisible: boolean;
  isPreviewing?: boolean;
}

const QuizEditorPanel: React.FC<QuizEditorPanelProps> = ({ isVisible, isPreviewing = false }) => {
  if (!isVisible) return null;

  return (
    <div className="h-full w-full">
      <QuizFlowEditor />
    </div>
  );
};

export default QuizEditorPanel;
