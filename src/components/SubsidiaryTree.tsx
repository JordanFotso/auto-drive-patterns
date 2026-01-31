import React from 'react';
import { Building, Briefcase, Plus } from 'lucide-react';

// Define the Societe type to match the backend structure
interface Societe {
  id: number;
  nom: string;
  type_societe: 'COMPOSITE' | 'FEUILLE';
  filiales?: Societe[];
}

interface SubsidiaryTreeProps {
  societe: Societe;
  level?: number;
  onAddSubsidiary?: (parentId: number) => void;
}

const SubsidiaryTree: React.FC<SubsidiaryTreeProps> = ({ societe, level = 0, onAddSubsidiary }) => {
  const isComposite = societe.type_societe === 'COMPOSITE';

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="my-2">
      <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
        <div className="flex items-center gap-2">
          {isComposite ? (
            <Building className="h-5 w-5 text-gold" />
          ) : (
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="font-medium">{societe.nom}</span>
        </div>
        {isComposite && onAddSubsidiary && (
          <button
            onClick={() => onAddSubsidiary(societe.id)}
            className="p-1 rounded-full hover:bg-gold/20 transition-colors"
            title="Ajouter une filiale"
          >
            <Plus className="h-4 w-4 text-gold" />
          </button>
        )}
      </div>
      {isComposite && societe.filiales && societe.filiales.length > 0 && (
        <div className="mt-1 border-l-2 border-gold/50 pl-2">
          {societe.filiales.map((filiale) => (
            <SubsidiaryTree 
              key={filiale.id} 
              societe={filiale} 
              level={level + 1} 
              onAddSubsidiary={onAddSubsidiary} // Pass the prop recursively
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default SubsidiaryTree;
