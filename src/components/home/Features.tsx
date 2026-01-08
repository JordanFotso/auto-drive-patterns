import { Shield, Truck, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Garantie Premium',
    description: 'Tous nos véhicules sont couverts par une garantie complète de 2 ans.',
  },
  {
    icon: Truck,
    title: 'Livraison Express',
    description: 'Livraison à domicile dans toute la France sous 48h.',
  },
  {
    icon: CreditCard,
    title: 'Financement Flexible',
    description: 'Solutions de crédit adaptées à votre budget.',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous accompagner.',
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
            Pourquoi nous choisir
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            L'excellence à votre service
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-card shadow-elegant hover-lift animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mb-4">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
