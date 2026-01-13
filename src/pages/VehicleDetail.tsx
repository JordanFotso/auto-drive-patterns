import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VehicleOption } from '@/types/vehicle';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OptionsConfigurator from '@/components/vehicles/OptionsConfigurator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Car, Bike, Zap, Gauge, Clock, Wind } from 'lucide-react';
import { useVehicle } from '@/hooks/useVehicle'; // Import du hook

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<VehicleOption[]>([]);

  const { data: vehicle, isLoading, isError, error } = useVehicle(id || ''); // Passer une chaîne vide si id est undefined

  // Calculs du prix, dépendent de `vehicle` donc doivent être après la vérification `!vehicle` si `vehicle` peut être undefined
  // Cependant, les hooks `useMemo` DOIVENT être appelés de manière inconditionnelle.
  // Nous allons les laisser ici et s'assurer que `vehicle` est défini avant d'y accéder à l'intérieur de useMemo.

  const discountedPrice = useMemo(() => {
    if (!vehicle) return 0; // Gérer le cas où vehicle est undefined pendant le premier rendu
    return vehicle.isOnSale && vehicle.saleDiscount
      ? vehicle.basePrice - vehicle.saleDiscount
      : vehicle.basePrice;
  }, [vehicle]);

  const optionsPrice = useMemo(() => {
    return selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  }, [selectedOptions]);

  const totalPrice = discountedPrice + optionsPrice;

  // Gérer la logique de chargement et d'erreur avant d'accéder à `vehicle` pour le rendu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-foreground">Chargement du véhicule...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-red-500">Erreur: {error?.message}</p>
      </div>
    );
  }

  // Si le véhicule n'est pas trouvé après le chargement
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

  const VehicleIcon = vehicle.type.toLowerCase() === 'automobile' ? Car : Bike;

  const specs = [
    { icon: Zap, label: 'Moteur', value: vehicle.specifications?.engine || 'N/A' },
    { icon: Gauge, label: 'Puissance', value: vehicle.specifications?.power || 'N/A' },
    { icon: Clock, label: '0-100 km/h', value: vehicle.specifications?.acceleration || 'N/A' },
    { icon: Wind, label: 'Vitesse max', value: vehicle.specifications?.topSpeed || 'N/A' },
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
                    -{((vehicle.saleDiscount / vehicle.basePrice) * 100).toFixed(0)}%
                  </Badge>
                )}
                <img
                  src={vehicle.image}
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
                    {vehicle.type === 'AUTOMOBILE' ? 'Automobile' : 'Scooter'}
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
                        {formatPrice(discountedPrice)}
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
              {vehicle.availableOptions && vehicle.availableOptions.length > 0 && (
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
