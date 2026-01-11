import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

const Header = () => {
  const { items, canUndo, canRedo, undo, redo } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/promotions', label: 'Promotions' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-foreground">
              Auto<span className="text-gradient-gold">Élite</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold",
                  location.pathname === link.href
                    ? "text-gold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Undo/Redo buttons */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Annuler"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Rétablir"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart */}
            <Link to="/panier">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-primary text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block text-base font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-2 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { undo(); setMobileMenuOpen(false); }}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { redo(); setMobileMenuOpen(false); }}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4 mr-2" />
                Rétablir
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
