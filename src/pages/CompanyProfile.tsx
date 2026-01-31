import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Loader2, Phone, Home, CreditCard, Edit, Briefcase, Building, Globe } from 'lucide-react';
import SubsidiaryTree from '@/components/SubsidiaryTree';
import CreateSubsidiaryModal from '@/components/CreateSubsidiaryModal';

const CompanyProfile = () => {
  const { userProfile, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleAddSubsidiary = (parentId: number) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const isCompanyUser = userProfile.roles && userProfile.roles.includes('ROLE_COMPANY_USER');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Profil <span className="text-gradient-gold">Entreprise</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez le compte de votre entreprise et consultez vos informations.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gold" />
                    Informations Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gold">
                        {userProfile.societe?.nom?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{userProfile.societe?.nom}</p>
                      {isCompanyUser && <Badge variant="secondary" className="mt-1">Compte Entreprise</Badge>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Contact: {userProfile.contactPersonName}</span>
                    </div>
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
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>N° Siret: {userProfile.companyRegistrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{userProfile.website}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.companyBankAccountNumber}</span>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gold" />
                    Structure de l'Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile.societe ? (
                    <SubsidiaryTree societe={userProfile.societe} onAddSubsidiary={handleAddSubsidiary} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune structure d'entreprise à afficher.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <CreateSubsidiaryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          parentId={selectedParentId} 
        />
      )}
    </div>
  );
};

export default CompanyProfile;
