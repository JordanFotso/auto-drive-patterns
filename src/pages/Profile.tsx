import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { User, Mail, Calendar, ShoppingBag, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { orders } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userOrders = orders; // In a real app, filter by user ID
  const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Mon <span className="text-gradient-gold">Profil</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre compte et consultez vos informations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User info card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">Client</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                  >
                    Déconnexion
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stats and orders */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gold/20 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{userOrders.length}</p>
                        <p className="text-sm text-muted-foreground">Commandes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {totalSpent.toLocaleString('fr-FR')} €
                        </p>
                        <p className="text-sm text-muted-foreground">Total dépensé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    Commandes récentes
                  </CardTitle>
                  <Link to="/mes-commandes">
                    <Button variant="ghost" size="sm">
                      Voir tout
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Aucune commande pour le moment</p>
                      <Link to="/catalogue">
                        <Button className="mt-4 bg-gold hover:bg-gold/90 text-primary">
                          Découvrir le catalogue
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userOrders.slice(0, 3).map((order) => (
                        <Link
                          key={order.id}
                          to={`/commande/${order.id}`}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">
                              Commande #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} véhicule(s) • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gold">
                              {order.totalAmount.toLocaleString('fr-FR')} €
                            </p>
                            <Badge 
                              variant="secondary"
                              className={
                                order.state === 'delivered' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : order.state === 'validated'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : ''
                              }
                            >
                              {order.state === 'pending' && 'En cours'}
                              {order.state === 'validated' && 'Validée'}
                              {order.state === 'delivered' && 'Livrée'}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
