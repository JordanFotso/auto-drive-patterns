import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-display font-bold mb-4">
              Auto<span className="text-gradient-gold">Élite</span>
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              Votre partenaire de confiance pour l'acquisition de véhicules d'exception.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Navigation</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/" className="hover:text-gold transition-colors">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-gold transition-colors">Catalogue</Link></li>
              <li><Link to="/promotions" className="hover:text-gold transition-colors">Promotions</Link></li>
              <li><Link to="/panier" className="hover:text-gold transition-colors">Panier</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Services</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>Financement</li>
              <li>Assurance</li>
              <li>Livraison</li>
              <li>Service après-vente</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>contact@autoelite.fr</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8 text-center text-sm text-cream/50">
          <p>© 2024 AutoÉlite. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
