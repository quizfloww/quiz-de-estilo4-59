import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, FileEdit, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived';
}

const statusConfig = {
  draft: {
    label: 'Rascunho',
    icon: FileEdit,
    className: 'bg-muted text-muted-foreground hover:bg-muted',
  },
  published: {
    label: 'Publicado',
    icon: Globe,
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20',
  },
  archived: {
    label: 'Arquivado',
    icon: Archive,
    className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
