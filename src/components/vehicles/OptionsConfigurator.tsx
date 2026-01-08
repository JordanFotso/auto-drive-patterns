import { useState, useMemo } from 'react';
import { VehicleOption } from '@/types/vehicle';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionsConfiguratorProps {
  availableOptions: VehicleOption[];
  selectedOptions: VehicleOption[];
  onOptionsChange: (options: VehicleOption[]) => void;
}

const OptionsConfigurator = ({
  availableOptions,
  selectedOptions,
  onOptionsChange,
}: OptionsConfiguratorProps) => {
  // Group options by category
  const groupedOptions = useMemo(() => {
    return availableOptions.reduce((acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = [];
      }
      acc[option.category].push(option);
      return acc;
    }, {} as Record<string, VehicleOption[]>);
  }, [availableOptions]);

  // Check if an option is incompatible with currently selected options
  const isIncompatible = (option: VehicleOption) => {
    return selectedOptions.some(
      (selected) =>
        selected.incompatibleWith.includes(option.id) ||
        option.incompatibleWith.includes(selected.id)
    );
  };

  // Get which selected option is causing the incompatibility
  const getIncompatibleWith = (option: VehicleOption) => {
    return selectedOptions.find(
      (selected) =>
        selected.incompatibleWith.includes(option.id) ||
        option.incompatibleWith.includes(selected.id)
    );
  };

  const isSelected = (optionId: string) => {
    return selectedOptions.some((o) => o.id === optionId);
  };

  const toggleOption = (option: VehicleOption) => {
    if (isSelected(option.id)) {
      // Remove option
      onOptionsChange(selectedOptions.filter((o) => o.id !== option.id));
    } else if (!isIncompatible(option)) {
      // Add option
      onOptionsChange([...selectedOptions, option]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Options disponibles</h3>
      
      {Object.entries(groupedOptions).map(([category, options]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {category}
          </h4>
          <div className="space-y-2">
            {options.map((option) => {
              const incompatible = isIncompatible(option);
              const selected = isSelected(option.id);
              const incompatibleOption = incompatible ? getIncompatibleWith(option) : null;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                    selected
                      ? "border-gold bg-gold/10"
                      : incompatible
                      ? "border-muted bg-muted/50 opacity-60 cursor-not-allowed"
                      : "border-border hover:border-gold/50 hover:bg-muted/30"
                  )}
                  onClick={() => !incompatible && toggleOption(option)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        selected
                          ? "bg-gold border-gold"
                          : incompatible
                          ? "border-muted-foreground/30"
                          : "border-muted-foreground/50"
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium",
                        incompatible ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {option.name}
                      </p>
                      {incompatible && incompatibleOption && (
                        <p className="text-xs text-destructive flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Incompatible avec {incompatibleOption.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={selected ? "default" : "outline"} className={cn(
                    selected && "bg-gold text-primary"
                  )}>
                    +{formatPrice(option.price)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected options summary */}
      {selectedOptions.length > 0 && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Options sélectionnées: {selectedOptions.length}
          </p>
          <p className="text-lg font-semibold text-gold">
            Total options: {formatPrice(selectedOptions.reduce((sum, o) => sum + o.price, 0))}
          </p>
        </div>
      )}
    </div>
  );
};

export default OptionsConfigurator;
