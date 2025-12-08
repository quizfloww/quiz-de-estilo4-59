import React from "react";
import { Eye, Copy, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FunnelTemplateCardProps {
  title: string;
  description: string;
  image?: string;
  slug?: string;
  isPrimary?: boolean;
  isBlank?: boolean;
  onView?: () => void;
  onUse?: () => void;
  onCreate?: () => void;
}

export function FunnelTemplateCard({
  title,
  description,
  image,
  slug,
  isPrimary,
  isBlank,
  onView,
  onUse,
  onCreate,
}: FunnelTemplateCardProps) {
  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20"
      data-testid={`template-card-${slug || "blank"}`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {isBlank ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
          </div>
        ) : image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}

        {isPrimary && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white gap-1">
            <Star className="h-3 w-3 fill-current" />
            Principal
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {slug && (
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            /{slug}
          </p>
        )}

        <div className="flex gap-2">
          {isBlank ? (
            <Button onClick={onCreate} className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Criar Novo
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onView}
                size="sm"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              <Button
                onClick={onUse}
                size="sm"
                className="flex-1"
                data-testid={`template-use-${slug || "blank"}`}
              >
                <Copy className="h-4 w-4 mr-1" />
                Usar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
