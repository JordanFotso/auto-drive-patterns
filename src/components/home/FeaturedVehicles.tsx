import VehicleCard from '@/components/vehicles/VehicleCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedVehicles = () => {
  const { data: featuredVehicles, isLoading, isError } = useVehicles({
    sortBy: 'price_desc',
    limit: 3,
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
              Sélection exclusive
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Véhicules en vedette
            </h2>
          </div>
          <Link to="/catalogue" className="mt-4 md:mt-0">
            <Button variant="ghost" className="group">
              Voir tout le catalogue
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[400px] w-full rounded-xl" />
            ))
          ) : isError || !featuredVehicles ? (
            <div className="col-span-3 text-center text-destructive">
              Erreur lors du chargement des véhicules.
            </div>
          ) : (
            featuredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
