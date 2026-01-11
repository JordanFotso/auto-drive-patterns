import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientTree from '@/components/clients/ClientTree';
import AddClientDialog from '@/components/clients/AddClientDialog';
import FleetOrderForm from '@/components/clients/FleetOrderForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClients } from '@/context/ClientContext';
import { CompanyClient } from '@/patterns/composite/ClientComposite';
import { 
  Plus, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Users,
  TrendingDown,
  FileText
} from 'lucide-react';

const Clients = () => {
  const { 
    clients, 
    selectedClient, 
    selectClient, 
    removeSubsidiary,
    getFleetOrdersByClient 
  } = useClients();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addSubsidiaryParentId, setAddSubsidiaryParentId] = useState<string | undefined>();

  const handleAddSubsidiary = (parentId: string) => {
    setAddSubsidiaryParentId(parentId);
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setAddSubsidiaryParentId(undefined);
  };

  const isCompany = selectedClient?.getType() === 'company';
  const company = isCompany ? (selectedClient as CompanyClient) : null;
  const fleetOrders = selectedClient ? getFleetOrdersByClient(selectedClient.id) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                Gestion <span className="text-gradient-gold">Clients</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos clients particuliers et entreprises avec leurs filiales
              </p>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gold hover:bg-gold/90 text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Client tree */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gold" />
                    Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clients.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Aucun client enregistré
                    </p>
                  ) : (
                    <ClientTree
                      clients={clients}
                      selectedClientId={selectedClient?.id || null}
                      onSelectClient={selectClient}
                      onAddSubsidiary={handleAddSubsidiary}
                      onRemoveSubsidiary={removeSubsidiary}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Client details & Fleet order */}
            <div className="lg:col-span-2 space-y-6">
              {selectedClient ? (
                <>
                  {/* Client details card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isCompany ? (
                          <Building2 className="h-5 w-5 text-gold" />
                        ) : (
                          <User className="h-5 w-5 text-gold" />
                        )}
                        {selectedClient.name}
                        <Badge variant="secondary" className="ml-2">
                          {isCompany ? 'Société' : 'Particulier'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedClient.email}</span>
                          </div>
                          
                          {isCompany && company && (
                            <>
                              <div className="flex items-center gap-3">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span>SIRET: {company.siret}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {company.employees} employés (directs)
                                  {company.getSubsidiaries().length > 0 && (
                                    <span className="text-muted-foreground ml-1">
                                      • {selectedClient.getTotalEmployees()} total groupe
                                    </span>
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="space-y-4">
                          {isCompany && (
                            <>
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{company?.getSubsidiaries().length || 0} filiale(s)</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <TrendingDown className="h-4 w-4 text-green-400" />
                                <span>
                                  Remise flotte: 
                                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                                    {selectedClient.getFleetDiscount()}%
                                  </Badge>
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Fleet orders history */}
                      {fleetOrders.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Commandes flotte récentes
                          </h4>
                          <div className="space-y-2">
                            {fleetOrders.slice(-3).map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {order.quantity} véhicule(s)
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gold">
                                    {order.totalAmount.toLocaleString('fr-FR')} €
                                  </p>
                                  {order.discount > 0 && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                      -{order.discount}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Fleet order form for companies */}
                  {isCompany && <FleetOrderForm client={selectedClient} />}
                </>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Sélectionnez un client pour voir ses détails
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AddClientDialog
        open={showAddDialog}
        onClose={handleCloseDialog}
        parentCompanyId={addSubsidiaryParentId}
      />
    </div>
  );
};

export default Clients;
