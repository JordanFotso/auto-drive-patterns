import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury vehicle"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20 md:pt-0">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6 animate-fade-up">
            <span className="text-gold text-sm font-medium">Nouvelle collection 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-cream leading-tight mb-6 animate-fade-up stagger-1">
            L'Excellence
            <br />
            <span className="text-gradient-gold">Automobile</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-cream/70 leading-relaxed mb-8 max-w-lg animate-fade-up stagger-2">
            Découvrez notre sélection exclusive de véhicules d'exception. 
            Performance, élégance et innovation au service de vos rêves.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-3">
            <Link to="/catalogue">
              <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                Explorer le catalogue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
              <Play className="h-5 w-5" />
              Voir la vidéo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-cream/10 animate-fade-up stagger-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">150+</p>
              <p className="text-sm text-cream/60 mt-1">Véhicules</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">50+</p>
              <p className="text-sm text-cream/60 mt-1">Marques</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">5k+</p>
              <p className="text-sm text-cream/60 mt-1">Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
