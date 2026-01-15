import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getOrderStateHandler, orderStateColors } from '@/patterns/state/OrderState';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Eye, 
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Définir les types pour correspondre à la réponse du backend
type BackendOrderItem = {
  vehicule: { id: number; name: string };
  quantity: number;
};

type BackendOrder = {
  id: number;
  dateCommande: string; 
  montantTotal: number;
  status: 'EN_COURS' | 'VALIDEE' | 'LIVREE' | 'ANNULEE';
  paysLivraison: string;
  typeCommande: 'Comptant' | 'Crédit';
  items: BackendOrderItem[];
};

type FrontendOrderState = 'pending' | 'validated' | 'delivered' | 'cancelled';

const mapBackendStatusToFrontendState = (status: BackendOrder['status']): FrontendOrderState => {
  switch (status) {
    case 'EN_COURS': return 'pending';
    case 'VALIDEE': return 'validated';
    case 'LIVREE': return 'delivered';
    case 'ANNULEE': return 'cancelled';
    default: return 'pending';
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const { data: orders = [], isLoading, isError, error } = useQuery<BackendOrder[]>({
    queryKey: ['orders', 'me'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/commandes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Impossible de récupérer les commandes.');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-16 bg-destructive/10 text-destructive rounded-lg">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error instanceof Error ? error.message : 'Une erreur est survenue.'}</p>
        </div>
      );
    }
    
    if (orders.length === 0) {
      return (
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
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const frontendState = mapBackendStatusToFrontendState(order.status);
          const stateHandler = getOrderStateHandler(frontendState);
          const stateColors = orderStateColors[frontendState] || orderStateColors.pending;

          return (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-mono font-bold text-lg">CMD-{order.id}</span>
                    <Badge className={`${stateColors.bg} ${stateColors.text}`}>
                      {stateHandler.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.dateCommande)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {order.paysLivraison}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {order.typeCommande}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {order.items.slice(0, 3).map((item) => (
                      <Badge key={item.vehicule.id} variant="outline">
                        {item.vehicule.name}
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
                      {formatPrice(order.montantTotal)}
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
    );
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
                {isLoading ? 'Chargement...' : `${orders.length} commande(s)`}
              </p>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
