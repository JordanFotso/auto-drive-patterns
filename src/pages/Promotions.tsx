import VehicleCard from '@/components/vehicles/VehicleCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tag } from 'lucide-react';
import { usePromotions } from '@/hooks/usePromotions'; // Import du hook

const Promotions = () => {
  const { data: promotions, isLoading, isError, error } = usePromotions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-foreground">Chargement des promotions...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Hero section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 mb-6">
              <Tag className="h-4 w-4 text-destructive mr-2" />
              <span className="text-destructive text-sm font-medium">Offres limitées</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
              Promotions en cours
            </h1>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto">
              Profitez de remises exceptionnelles sur une sélection de véhicules. 
              Ces offres sont à durée limitée !
            </p>
          </div>
        </section>

        {/* Vehicles grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {promotions && promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Aucune promotion en cours pour le moment.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Revenez bientôt pour découvrir nos offres !
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

export default Promotions;
