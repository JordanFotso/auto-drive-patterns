import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicles } from '@/data/vehicles';
import { VehicleOption } from '@/types/vehicle';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OptionsConfigurator from '@/components/vehicles/OptionsConfigurator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Car, Bike, Zap, Gauge, Clock, Wind } from 'lucide-react';

// Vehicle images mapping
import eleganceGt from '@/assets/vehicles/elegance-gt.jpg';
import voyagerLuxe from '@/assets/vehicles/voyager-luxe.jpg';
import urbanRider from '@/assets/vehicles/urban-rider.jpg';
import thunderX from '@/assets/vehicles/thunder-x.jpg';
import electraVision from '@/assets/vehicles/electra-vision.jpg';
import nomadExplorer from '@/assets/vehicles/nomad-explorer.jpg';

const vehicleImages: Record<string, string> = {
  'v1': eleganceGt,
  'v2': voyagerLuxe,
  'v3': urbanRider,
  'v4': thunderX,
  'v5': electraVision,
  'v6': nomadExplorer,
};

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<VehicleOption[]>([]);

  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Véhicule non trouvé</h1>
          <Link to="/catalogue">
            <Button>Retour au catalogue</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const basePrice = vehicle.isOnSale && vehicle.saleDiscount
    ? vehicle.basePrice * (1 - vehicle.saleDiscount / 100)
    : vehicle.basePrice;

  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const totalPrice = basePrice + optionsPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(vehicle, selectedOptions);
    navigate('/panier');
  };

  const VehicleIcon = vehicle.type === 'automobile' ? Car : Bike;

  const specs = [
    { icon: Zap, label: 'Moteur', value: vehicle.specifications.engine },
    { icon: Gauge, label: 'Puissance', value: vehicle.specifications.power },
    { icon: Clock, label: '0-100 km/h', value: vehicle.specifications.acceleration },
    { icon: Wind, label: 'Vitesse max', value: vehicle.specifications.topSpeed },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/catalogue">
            <Button variant="ghost" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Retour au catalogue
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image section */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                {vehicle.isOnSale && (
                  <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground">
                    -{vehicle.saleDiscount}%
                  </Badge>
                )}
                <img
                  src={vehicleImages[vehicle.id] || eleganceGt}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <spec.icon className="h-5 w-5 text-gold mb-2" />
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-semibold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details section */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    <VehicleIcon className="h-3 w-3 mr-1" />
                    {vehicle.type === 'automobile' ? 'Automobile' : 'Scooter'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{vehicle.brand}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {vehicle.name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Price */}
              <div className="p-6 rounded-xl bg-secondary border border-border">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prix de base</p>
                    <div className="flex items-baseline gap-2">
                      {vehicle.isOnSale && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(vehicle.basePrice)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(basePrice)}
                      </span>
                    </div>
                  </div>
                  {optionsPrice > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Options</p>
                      <span className="text-lg font-semibold text-gold">
                        +{formatPrice(optionsPrice)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-3xl font-bold text-gradient-gold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Options configurator */}
              {vehicle.availableOptions.length > 0 && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <OptionsConfigurator
                    availableOptions={vehicle.availableOptions}
                    selectedOptions={selectedOptions}
                    onOptionsChange={setSelectedOptions}
                  />
                </div>
              )}

              {/* Add to cart */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleDetail;
