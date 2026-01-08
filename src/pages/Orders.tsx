import { useNavigate } from 'react-router-dom';
import { useOrder } from '@/context/OrderContext';
import { getOrderStateHandler, orderStateColors } from '@/patterns/state/OrderState';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Mes Commandes
              </h1>
              <p className="text-muted-foreground">
                {orders.length} commande(s)
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Aucune commande
              </h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore passé de commande
              </p>
              <Button variant="hero" onClick={() => navigate('/catalogue')}>
                Parcourir le catalogue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const stateHandler = getOrderStateHandler(order.state);
                const stateColors = orderStateColors[order.state];

                return (
                  <Card key={order.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-mono font-bold text-lg">{order.id}</span>
                          <Badge className={`${stateColors.bg} ${stateColors.text}`}>
                            {stateHandler.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            {order.paymentMethod === 'cash' ? 'Comptant' : 'Crédit'}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {order.items.slice(0, 3).map((item) => (
                            <Badge key={item.vehicle.id} variant="outline">
                              {item.vehicle.name}
                            </Badge>
                          ))}
                          {order.items.length > 3 && (
                            <Badge variant="outline">+{order.items.length - 3} autres</Badge>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total TTC</p>
                          <p className="text-2xl font-bold text-gradient-gold">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/commande/${order.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
