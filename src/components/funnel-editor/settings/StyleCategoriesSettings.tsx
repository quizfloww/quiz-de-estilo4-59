import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleCategoryConfig } from "@/types/funnelConfig";
import { Plus, Trash2, Image, BookOpen, Palette } from "lucide-react";

interface StyleCategoriesSettingsProps {
  categories: StyleCategoryConfig[];
  onChange: (categories: StyleCategoryConfig[]) => void;
}

export const StyleCategoriesSettings: React.FC<
  StyleCategoriesSettingsProps
> = ({ categories, onChange }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryChange = (
    index: number,
    field: keyof StyleCategoryConfig,
    value: string | string[]
  ) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addCategory = () => {
    const newCategory: StyleCategoryConfig = {
      id: `style-${Date.now()}`,
      name: "Novo Estilo",
      description: "Descrição curta do estilo",
      detailedDescription: "Descrição detalhada do estilo",
      imageUrl: "",
      guideImageUrl: "",
      characteristics: [],
      colors: [],
    };
    onChange([...categories, newCategory]);
    setExpandedCategory(newCategory.id);
  };

  const removeCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleArrayField = (
    index: number,
    field: "characteristics" | "colors",
    value: string
  ) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    handleCategoryChange(index, field, items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Categorias de Estilo ({categories.length})
        </Label>
        <Button variant="outline" size="sm" onClick={addCategory}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Palette className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma categoria de estilo configurada</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={addCategory}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar primeira categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedCategory || undefined}
          onValueChange={(value) => setExpandedCategory(value || null)}
        >
          {categories.map((category, index) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      ID (único)
                    </Label>
                    <Input
                      value={category.id}
                      onChange={(e) =>
                        handleCategoryChange(index, "id", e.target.value)
                      }
                      placeholder="natural"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Nome
                    </Label>
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        handleCategoryChange(index, "name", e.target.value)
                      }
                      placeholder="Natural"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Descrição curta
                  </Label>
                  <Input
                    value={category.description}
                    onChange={(e) =>
                      handleCategoryChange(index, "description", e.target.value)
                    }
                    placeholder="Informal, espontânea, alegre"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Descrição detalhada
                  </Label>
                  <Textarea
                    value={category.detailedDescription || ""}
                    onChange={(e) =>
                      handleCategoryChange(
                        index,
                        "detailedDescription",
                        e.target.value
                      )
                    }
                    placeholder="Você valoriza o conforto e a praticidade..."
                    rows={2}
                  />
                </div>

                {/* Imagens */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-xs font-medium">Imagens</Label>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Imagem do estilo
                      </Label>
                      <Input
                        value={category.imageUrl}
                        onChange={(e) =>
                          handleCategoryChange(
                            index,
                            "imageUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                      />
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Imagem do guia
                      </Label>
                      <Input
                        value={category.guideImageUrl || ""}
                        onChange={(e) =>
                          handleCategoryChange(
                            index,
                            "guideImageUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                      />
                      {category.guideImageUrl && (
                        <img
                          src={category.guideImageUrl}
                          alt={`Guia ${category.name}`}
                          className="w-20 h-auto rounded-lg object-cover"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        URL do Material/Compra
                      </Label>
                      <Input
                        value={category.materialUrl || ""}
                        onChange={(e) =>
                          handleCategoryChange(
                            index,
                            "materialUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://pay.hotmart.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Características e Cores */}
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Características (separadas por vírgula)
                      </Label>
                      <Input
                        value={(category.characteristics || []).join(", ")}
                        onChange={(e) =>
                          handleArrayField(
                            index,
                            "characteristics",
                            e.target.value
                          )
                        }
                        placeholder="Conforto, Praticidade, Autenticidade"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Paleta de cores (códigos hex separados por vírgula)
                      </Label>
                      <Input
                        value={(category.colors || []).join(", ")}
                        onChange={(e) =>
                          handleArrayField(index, "colors", e.target.value)
                        }
                        placeholder="#8B7355, #A0522D, #DEB887"
                      />
                      {category.colors && category.colors.length > 0 && (
                        <div className="flex gap-1">
                          {category.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botão de remover */}
                <div className="border-t pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCategory(index)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover "{category.name}"
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
