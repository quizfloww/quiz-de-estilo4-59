import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Copy, Eye, MoreHorizontal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface FunnelCardProps {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  description?: string | null;
  coverImage?: string | null;
  createdAt: string;
  onDelete: () => void;
}

const statusConfig = {
  draft: { label: 'Rascunho', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  published: { label: 'Publicado', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
  archived: { label: 'Arquivado', className: 'bg-muted text-muted-foreground border-border' },
};

export function FunnelCard({
  id,
  name,
  slug,
  status,
  description,
  coverImage,
  createdAt,
  onDelete,
}: FunnelCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <FileText className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        <Badge 
          variant="outline" 
          className={`absolute top-2 left-2 ${statusInfo.className}`}
        >
          {statusInfo.label}
        </Badge>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/admin/funnels/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/quiz/${slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-1 truncate">{name}</h3>
        <p className="text-xs text-muted-foreground font-mono mb-2">/{slug}</p>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleDateString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  );
}
