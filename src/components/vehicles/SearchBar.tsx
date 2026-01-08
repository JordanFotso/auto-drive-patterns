import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string, operator: 'AND' | 'OR') => void;
  onFilterType: (type: 'all' | 'automobile' | 'scooter') => void;
}

const SearchBar = ({ onSearch, onFilterType }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [operator, setOperator] = useState<'AND' | 'OR'>('AND');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query, operator);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('', operator);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher des véhicules... (ex: sport V8, électrique luxe)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-12 bg-card border-border focus:border-gold"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Operator selector */}
        <Select value={operator} onValueChange={(value: 'AND' | 'OR') => setOperator(value)}>
          <SelectTrigger className="w-full md:w-32 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">ET</SelectItem>
            <SelectItem value="OR">OU</SelectItem>
          </SelectContent>
        </Select>

        {/* Search button */}
        <Button onClick={handleSearch} variant="hero" size="lg" className="h-12">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>

        {/* Filter toggle */}
        <Button
          variant="outline"
          size="lg"
          className="h-12"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg animate-fade-in">
          <span className="text-sm font-medium text-muted-foreground mr-2">Type:</span>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gold hover:text-primary transition-colors"
            onClick={() => onFilterType('all')}
          >
            Tous
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gold hover:text-primary transition-colors"
            onClick={() => onFilterType('automobile')}
          >
            Automobiles
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gold hover:text-primary transition-colors"
            onClick={() => onFilterType('scooter')}
          >
            Scooters
          </Badge>
        </div>
      )}

      {/* Search tips */}
      <p className="text-xs text-muted-foreground">
        💡 Utilisez plusieurs mots-clés avec l'opérateur ET ou OU pour affiner votre recherche
      </p>
    </div>
  );
};

export default SearchBar;
