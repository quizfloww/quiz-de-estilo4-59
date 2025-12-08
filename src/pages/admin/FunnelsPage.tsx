import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, LayoutTemplate, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  useFunnels,
  useCreateFunnel,
  useDeleteFunnel,
} from "@/hooks/useFunnels";
import { useBulkInsertFunnelData } from "@/hooks/useBulkFunnelData";
import { FunnelTemplateCard } from "@/components/admin/FunnelTemplateCard";
import { FunnelCard } from "@/components/admin/FunnelCard";
import { toast } from "sonner";
import {
  FunnelConfig,
  DEFAULT_QUIZ_CONFIG,
  EMPTY_FUNNEL_CONFIG,
} from "@/types/funnelConfig";
import { defaultQuizFlowConfig } from "@/data/quizFlowConfig";
import type { Database } from "@/integrations/supabase/types";
import { isSupabaseAvailable } from "@/integrations/supabase/client";

type StageType = Database["public"]["Enums"]["stage_type"];

interface FunnelTemplate {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  isPrimary: boolean;
  config: FunnelConfig;
  includeStages?: boolean; // Flag to include full quiz stages
}

const TEMPLATES: FunnelTemplate[] = [
  {
    id: "quiz-principal",
    title: "Quiz de Estilo Pessoal",
    description:
      "O modelo principal do quiz com 10 questões de estilo + 7 estratégicas",
    slug: "quiz",
    image:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp",
    isPrimary: true,
    config: DEFAULT_QUIZ_CONFIG,
    includeStages: true,
  },
  {
    id: "quiz-descubra",
    title: "Quiz Descubra seu Estilo",
    description: "Variante A/B com página de oferta diferenciada",
    slug: "quiz-descubra-seu-estilo",
    image:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up",
    isPrimary: false,
    config: {
      ...DEFAULT_QUIZ_CONFIG,
      seo: {
        ...DEFAULT_QUIZ_CONFIG.seo,
        title: "Descubra seu Estilo Pessoal | Gisele Galvão",
        description:
          "Faça o teste gratuito e descubra qual estilo mais combina com você!",
      },
    },
    includeStages: true,
  },
];

// Convert QuizFlowStage to database stage format
const convertQuizFlowToStages = (funnelId: string) => {
  const stages = defaultQuizFlowConfig.stages.map((stage, index) => {
    // Map stage type to database enum
    let dbType: StageType = "question";
    if (stage.type === "intro") dbType = "intro";
    else if (stage.type === "transition") dbType = "transition";
    else if (stage.type === "strategic") dbType = "strategic";
    else if (stage.type === "result") dbType = "result";
    else if (stage.type === "question") dbType = "question";

    // Extract options from config (to be stored in stage_options table)
    const { options, ...configWithoutOptions } = stage.config as any;

    return {
      type: dbType,
      title: stage.title,
      order_index: index,
      is_enabled: stage.isEnabled,
      config: configWithoutOptions,
    };
  });

  // Build options map keyed by order_index
  const optionsMap = new Map<
    number,
    Array<{
      text: string;
      image_url: string | null;
      style_category: string | null;
      points: number;
      order_index: number;
    }>
  >();

  defaultQuizFlowConfig.stages.forEach((stage, stageIndex) => {
    const config = stage.config as any;
    if (config.options && Array.isArray(config.options)) {
      const stageOptions = config.options.map((opt: any, optIndex: number) => ({
        text: opt.text,
        image_url: opt.imageUrl || null,
        style_category: opt.styleCategory || null,
        points: opt.points || 1,
        order_index: optIndex,
      }));
      optionsMap.set(stageIndex, stageOptions);
    }
  });

  return { stages, optionsMap };
};

export default function FunnelsPage() {
  const navigate = useNavigate();
  const { data: funnels, isLoading, error } = useFunnels();
  const createFunnel = useCreateFunnel();
  const deleteFunnel = useDeleteFunnel();
  const bulkInsert = useBulkInsertFunnelData();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateFunnel = async () => {
    if (!isSupabaseAvailable) {
      toast.error(
        "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
      );
      return;
    }
    const result = await createFunnel.mutateAsync({
      name: "Novo Funil",
      slug: `funil-${Date.now()}`,
    });
    navigate(`/admin/funnels/${result.id}/edit`);
  };

  const handleUseTemplate = async (template: FunnelTemplate) => {
    try {
      if (!isSupabaseAvailable) {
        toast.error(
          "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
        );
        return;
      }
      // 1. Create the funnel with config and style categories
      const result = await createFunnel.mutateAsync({
        name: `${template.title} - Cópia`,
        slug: `${template.slug}-${Date.now()}`,
        description: template.description,
        cover_image: template.image,
        global_config: template.config,
        style_categories: defaultQuizFlowConfig.styleCategories,
      });

      // 2. If template includes stages, create all stages and options
      if (template.includeStages) {
        const { stages, optionsMap } = convertQuizFlowToStages(result.id);

        await bulkInsert.mutateAsync({
          funnelId: result.id,
          stages,
          optionsMap,
        });
      }

      navigate(`/admin/funnels/${result.id}/edit`);
    } catch (error) {
      console.error("Error creating funnel from template:", error);
      toast.error("Erro ao criar funil");
    }
  };

  const handleViewTemplate = (slug: string) => {
    window.open(`/${slug}`, "_blank");
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteFunnel.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Funis</h1>
              <p className="text-muted-foreground">
                Gerencie seus funis de quiz
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateFunnel}
            disabled={createFunnel.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Funil
          </Button>
        </div>

        {/* Templates Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Modelos Disponíveis</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <FunnelTemplateCard
                key={template.id}
                title={template.title}
                description={template.description}
                image={template.image}
                slug={template.slug}
                isPrimary={template.isPrimary}
                onView={() => handleViewTemplate(template.slug)}
                onUse={() => handleUseTemplate(template)}
              />
            ))}

            <FunnelTemplateCard
              title="Modelo em Branco"
              description="Comece do zero e crie seu próprio funil personalizado"
              isBlank
              onCreate={handleCreateFunnel}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* My Funnels Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Meus Funis</h2>
            {funnels && funnels.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({funnels.length})
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/10]" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-destructive">
                  Erro ao carregar funis
                </p>
                <p className="text-sm text-muted-foreground break-all">
                  {error instanceof Error
                    ? error.message
                    : "Erro desconhecido ao consultar o Supabase."}
                </p>
                {!isSupabaseAvailable && (
                  <p className="text-sm text-muted-foreground">
                    Supabase não configurado: defina VITE_SUPABASE_URL e
                    VITE_SUPABASE_ANON_KEY nas variáveis do Vercel.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : funnels?.length === 0 ? (
            <Card className="text-center py-12 border-dashed">
              <CardContent>
                <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum funil criado ainda
                </p>
                <Button onClick={handleCreateFunnel} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar seu primeiro funil
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {funnels?.map((funnel) => (
                <FunnelCard
                  key={funnel.id}
                  id={funnel.id}
                  name={funnel.name}
                  slug={funnel.slug}
                  status={funnel.status}
                  description={funnel.description}
                  coverImage={funnel.cover_image}
                  createdAt={funnel.created_at}
                  onDelete={() => setDeleteId(funnel.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funil?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O funil e todas as suas etapas
              serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
