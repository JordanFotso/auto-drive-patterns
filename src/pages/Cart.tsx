import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, Undo, Redo } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart, 
    getTotalPrice, 
    canUndo, 
    canRedo, 
    undo, 
    redo 
  } = useCart();
  const { isAuthenticated } = useAuth(); // Récupérer l'état d'authentification

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemPrice = (item: typeof items[0]) => {
    const vehiclePrice = item.vehicle.isOnSale && item.vehicle.saleDiscount
      ? item.vehicle.basePrice - item.vehicle.saleDiscount
      : item.vehicle.basePrice;
    const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (vehiclePrice + optionsPrice);
  };

  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Votre Panier
              </h1>
              <p className="text-muted-foreground">
                {items.length} article(s)
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4 mr-2" />
                Rétablir
              </Button>
              {items.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearCart}>
                  Vider le panier
                </Button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty cart */
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Votre panier est vide
              </h2>
              <p className="text-muted-foreground mb-6">
                Découvrez notre catalogue de véhicules d'exception
              </p>
              <Link to="/catalogue">
                <Button variant="hero">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Parcourir le catalogue
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.vehicle.id}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    {/* Image */}
                    <div className="w-full md:w-40 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.vehicle.image}
                        alt={item.vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{item.vehicle.brand}</p>
                          <h3 className="text-lg font-semibold text-foreground">{item.vehicle.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Selected options */}
                      {item.selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.selectedOptions.map((opt) => (
                            <Badge key={opt.id} variant="outline" className="text-xs">
                              {opt.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price and Quantity */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => decrementQuantity(item.vehicle.id)}><Minus className="h-4 w-4"/></Button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <Button size="icon" variant="outline" onClick={() => incrementQuantity(item.vehicle.id)}><Plus className="h-4 w-4"/></Button>
                        </div>
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(getItemPrice(item) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.vehicle.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">
                          {item.vehicle.name} ({item.quantity}x)
                        </span>
                        <span className="text-foreground font-medium">
                          {formatPrice(getItemPrice(item) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-2xl font-bold text-gradient-gold">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>

                    <Button variant="hero" size="lg" className="w-full" onClick={handleCheckoutClick}>
                      Procéder au paiement
                    </Button>

                    <Link to="/catalogue">
                      <Button variant="ghost" className="w-full mt-3">
                        Continuer mes achats
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
