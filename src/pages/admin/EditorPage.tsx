import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  Save,
  Palette,
  Type,
  ArrowLeft,
  Workflow,
} from "lucide-react";
import { QuizFlowEditor } from "@/components/quiz-flow-editor/QuizFlowEditor";

// Lazy loading do editor para evitar problemas de importação
const QuizOfferPageVisualEditor = React.lazy(
  () => import("@/components/visual-editor/QuizOfferPageVisualEditor")
);

const EditorPage: React.FC = () => {
  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  // Quiz Flow Editor (novo)
  if (activeEditor === "quiz-flow") {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => setActiveEditor(null)}
            className="flex items-center gap-2 text-[#432818] hover:text-[#B89B7A]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <QuizFlowEditor />
        </div>
      </div>
    );
  }

  if (activeEditor === "quiz-offer") {
    return (
      <div className="h-screen">
        <div className="bg-white border-b p-4">
          <Button
            variant="ghost"
            onClick={() => setActiveEditor(null)}
            className="flex items-center gap-2 text-[#432818] hover:text-[#B89B7A]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B89B7A]"></div>
                <p className="mt-4 text-[#8F7A6A]">
                  Carregando editor visual...
                </p>
              </div>
            </div>
          }
        >
          <QuizOfferPageVisualEditor />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#432818]">Editores</h1>
          <p className="text-[#8F7A6A] mt-2">
            Selecione um editor para personalizar seu quiz
          </p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor de Fluxo do Quiz */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 bg-primary/5"
          onClick={() => setActiveEditor("quiz-flow")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Workflow className="h-5 w-5" />
              Editor de Fluxo do Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F7A6A]">
              Editor visual com drag-and-drop para criar e editar o fluxo
              completo do quiz com todas as etapas, opções e configurações
            </p>
            <Button
              variant="outline"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
            >
              <Workflow className="w-4 h-4 mr-2" />
              Abrir Editor de Fluxo
            </Button>
          </CardContent>
        </Card>

        {/* Editor Visual Completo */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveEditor("quiz-offer")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editor Visual Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F7A6A]">
              Editor completo da página de quiz e oferta com design ao vivo,
              cores, textos e layouts personalizáveis
            </p>
            <Button
              variant="outline"
              className="w-full bg-[#B89B7A] hover:bg-[#A0895B] text-white border-[#B89B7A]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Abrir Editor Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Nota:</span> Para editar funis
          específicos, visite a seção de Funis no menu principal. Para edição
          completa com canvas avançado, acesse o editor de funnil individual.
        </p>
      </div>
    </div>
  );
};

export default EditorPage;
