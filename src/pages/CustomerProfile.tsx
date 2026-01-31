import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, ShoppingBag, FileText, Loader2, Phone, Home, CreditCard, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerProfile = () => {
  const { userProfile, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // Assuming userProfile is a customer for this page
  const isCustomer = userProfile.roles && userProfile.roles.includes('ROLE_CUSTOMER');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Mon <span className="text-gradient-gold">Profil</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre compte et consultez vos informations.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gold">
                        {userProfile.firstName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                      {isCustomer && <Badge variant="secondary" className="mt-1">Client Particulier</Badge>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Né(e) le {new Date(userProfile.dob).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {/* In a real app, this should be masked or handled more securely */}
                      <span>{userProfile.bankAccountNumber}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={logout}
                    >
                      Déconnexion
                    </Button>
                    <Button className="w-full bg-gold hover:bg-gold/90">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto"
                    onClick={() => navigate('/mes-commandes')}
                  >
                    <CardTitle className="flex items-center gap-2 text-xl hover:text-gold transition-colors">
                      <ShoppingBag className="h-5 w-5 text-gold" />
                      Mes Commandes
                    </CardTitle>
                  </Button>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <Button 
                    className="bg-gold hover:bg-gold/90 text-primary"
                    onClick={() => navigate('/mes-commandes')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Voir mes commandes
                  </Button>
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

export default CustomerProfile;
