import { Link } from 'react-router-dom';
import { Vehicle } from '@/types/vehicle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

const VehicleCard = ({ vehicle, className }: VehicleCardProps) => {
  console.log('VehicleCard received vehicle:', vehicle);
  const discountedPrice = vehicle.isOnSale && vehicle.saleDiscount
    ? vehicle.basePrice - vehicle.saleDiscount
    : vehicle.basePrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const VehicleIcon = vehicle.type.toLowerCase() === 'automobile' ? Car : Bike;

  return (
    <div
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden shadow-card hover-lift border border-border/50",
        className
      )}
    >
      {/* Sale badge */}
      {vehicle.isOnSale && (
        <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground">
          -{((vehicle.saleDiscount / vehicle.basePrice) * 100).toFixed(0)}%
        </Badge>
      )}

      {/* Vehicle type badge */}
      <Badge variant="outline" className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm">
        <VehicleIcon className="h-3 w-3 mr-1" />
        {vehicle.type.toLowerCase() === 'automobile' ? 'Auto' : 'Scooter'}
      </Badge>

      {/* Image container */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-b from-muted to-muted/50">
        <img
          src={vehicle.image} // Utiliser directement l'URL de l'image du véhicule
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{vehicle.brand}</p>
            <h3 className="text-xl font-display font-semibold text-foreground">{vehicle.name}</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {vehicle.description}
        </p>

        {/* Specs preview */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span>{vehicle.specifications.power}</span>
          <span>•</span>
          <span>{vehicle.specifications.acceleration}</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-end justify-between">
          <div>
            {vehicle.isOnSale ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(vehicle.basePrice)}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(discountedPrice)}
                  </p>
                  <p className="text-sm font-semibold text-destructive">
                    -{((vehicle.saleDiscount / vehicle.basePrice) * 100).toFixed(0)}%
                  </p>
                </div>
              </>
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(vehicle.basePrice)}
              </p>
            )}
          </div>
          <Link to={`/vehicule/${vehicle.id}`}>
            <Button variant="premium" size="sm" className="group/btn">
              Découvrir
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
