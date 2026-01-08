import { useState, useMemo } from 'react';
import { vehicles } from '@/data/vehicles';
import { Vehicle, VehicleType } from '@/types/vehicle';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SearchBar from '@/components/vehicles/SearchBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Catalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOperator, setSearchOperator] = useState<'AND' | 'OR'>('AND');
  const [typeFilter, setTypeFilter] = useState<'all' | VehicleType>('all');
  const [gridLayout, setGridLayout] = useState<1 | 3>(3);

  // Filter and search vehicles
  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter((v) => v.type === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

      result = result.filter((vehicle) => {
        const searchableText = `
          ${vehicle.name} ${vehicle.brand} ${vehicle.model} ${vehicle.description}
          ${vehicle.specifications.engine} ${vehicle.specifications.power}
          ${vehicle.type}
        `.toLowerCase();

        if (searchOperator === 'AND') {
          return keywords.every((keyword) => searchableText.includes(keyword));
        } else {
          return keywords.some((keyword) => searchableText.includes(keyword));
        }
      });
    }

    return result;
  }, [searchQuery, searchOperator, typeFilter]);

  const handleSearch = (query: string, operator: 'AND' | 'OR') => {
    setSearchQuery(query);
    setSearchOperator(operator);
  };

  const handleFilterType = (type: 'all' | VehicleType) => {
    setTypeFilter(type);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Hero section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
              Notre Catalogue
            </h1>
            <p className="text-cream/70 text-lg max-w-2xl">
              Explorez notre sélection de véhicules d'exception. 
              Utilisez la recherche avancée pour trouver le véhicule parfait.
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={handleSearch} onFilterType={handleFilterType} />
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredVehicles.length}</span> véhicule(s) trouvé(s)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={gridLayout === 1 ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setGridLayout(1)}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridLayout === 3 ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setGridLayout(3)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid */}
            {filteredVehicles.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  gridLayout === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {filteredVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Aucun véhicule ne correspond à votre recherche.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Essayez avec d'autres mots-clés ou modifiez les filtres.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogue;
