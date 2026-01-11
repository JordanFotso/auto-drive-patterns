import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, User, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClientComponent, CompanyClient } from '@/patterns/composite/ClientComposite';
import { Badge } from '@/components/ui/badge';

interface ClientTreeProps {
  clients: ClientComponent[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  onAddSubsidiary?: (parentId: string) => void;
  onRemoveSubsidiary?: (parentId: string, subsidiaryId: string) => void;
}

interface ClientNodeProps {
  client: ClientComponent;
  level: number;
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  onAddSubsidiary?: (parentId: string) => void;
  onRemoveSubsidiary?: (parentId: string, subsidiaryId: string) => void;
  parentId?: string;
}

const ClientNode = ({
  client,
  level,
  selectedClientId,
  onSelectClient,
  onAddSubsidiary,
  onRemoveSubsidiary,
  parentId,
}: ClientNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isCompany = client.getType() === 'company';
  const company = isCompany ? (client as CompanyClient) : null;
  const subsidiaries = company?.getSubsidiaries() || [];
  const hasSubsidiaries = subsidiaries.length > 0;
  const isSelected = selectedClientId === client.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
          isSelected
            ? "bg-gold/20 border border-gold/30"
            : "hover:bg-muted/50",
          level > 0 && "ml-6"
        )}
        onClick={() => onSelectClient(client.id)}
      >
        {/* Expand/Collapse button */}
        {hasSubsidiaries ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Icon */}
        {isCompany ? (
          <Building2 className="h-5 w-5 text-gold" />
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}

        {/* Name and info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{client.name}</p>
          <p className="text-xs text-muted-foreground truncate">{client.email}</p>
        </div>

        {/* Badges and actions */}
        <div className="flex items-center gap-2">
          {isCompany && (
            <>
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {client.getTotalEmployees()}
              </Badge>
              {client.getFleetDiscount() > 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  -{client.getFleetDiscount()}%
                </Badge>
              )}
            </>
          )}
          
          {isCompany && onAddSubsidiary && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onAddSubsidiary(client.id);
              }}
              title="Ajouter une filiale"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          {parentId && onRemoveSubsidiary && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSubsidiary(parentId, client.id);
              }}
              title="Retirer la filiale"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Subsidiaries */}
      {hasSubsidiaries && isExpanded && (
        <div className="border-l-2 border-muted ml-5 mt-1">
          {subsidiaries.map((subsidiary) => (
            <ClientNode
              key={subsidiary.id}
              client={subsidiary}
              level={level + 1}
              selectedClientId={selectedClientId}
              onSelectClient={onSelectClient}
              onAddSubsidiary={onAddSubsidiary}
              onRemoveSubsidiary={onRemoveSubsidiary}
              parentId={client.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ClientTree = ({
  clients,
  selectedClientId,
  onSelectClient,
  onAddSubsidiary,
  onRemoveSubsidiary,
}: ClientTreeProps) => {
  return (
    <div className="space-y-2">
      {clients.map((client) => (
        <ClientNode
          key={client.id}
          client={client}
          level={0}
          selectedClientId={selectedClientId}
          onSelectClient={onSelectClient}
          onAddSubsidiary={onAddSubsidiary}
          onRemoveSubsidiary={onRemoveSubsidiary}
        />
      ))}
    </div>
  );
};

export default ClientTree;
