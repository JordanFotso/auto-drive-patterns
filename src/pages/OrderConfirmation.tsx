import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getOrderStateHandler, orderStateColors } from '@/patterns/state/OrderState';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrderProgressBar from '@/components/ui/order-progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Eye,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Types matching backend response
type BackendOrderItem = {
  vehicule: { id: number; name: string; brand: string; model: string; year: number; basePrice: number; saleDiscount: number; isOnSale: boolean; };
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
type DocumentFormat = 'html' | 'pdf';
type LiasseDocument = { type: string; format: DocumentFormat; content: string; };
type Liasse = { documents: LiasseDocument[] };

const mapBackendStatusToFrontendState = (status: BackendOrder['status']): FrontendOrderState => {
  switch (status) {
    case 'EN_COURS': return 'pending';
    case 'VALIDEE': return 'validated';
    case 'LIVREE': return 'delivered';
    case 'ANNULEE': return 'cancelled';
    default: return 'pending';
  }
};

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuth();
  
  const [generatedLiasse, setGeneratedLiasse] = useState<Liasse | null>(null);
  const [previewDocument, setPreviewDocument] = useState<LiasseDocument | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<DocumentFormat>('html');

  // Fetch order data
  const { data: order, isLoading: isLoadingOrder, isError, error } = useQuery<BackendOrder>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/commandes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Commande introuvable.');
      return response.json();
    },
    enabled: isAuthenticated && !!id,
  });
  
  // Mutation for document generation
  const { mutate: generateDocs, isPending: isGeneratingDocs } = useMutation<Liasse, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/commandes/${id}/liasse?format=${selectedFormat}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Échec de la génération des documents.');
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLiasse(data);
      toast.success('Documents générés avec succès !');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Mutation for state update
  const { mutate: updateState, isPending: isUpdatingState } = useMutation<BackendOrder, Error, { newStatus: 'valider' | 'approuver-credit' }>({
    mutationFn: async ({ newStatus }) => {
      const response = await fetch(`${API_BASE_URL}/api/commandes/${id}/${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Échec de la mise à jour du statut.');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Statut de la commande mis à jour.');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  if (isLoadingOrder) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  if (isError || !order) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20 md:pt-24 container mx-auto px-4 py-16 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-4">Commande Introuvable</h1>
                <p className="text-muted-foreground mb-6">{error?.message || "La commande que vous cherchez n'existe pas."}</p>
                <Button variant="hero" onClick={() => navigate('/mes-commandes')}>Retour aux commandes</Button>
            </main>
            <Footer />
        </div>
    );
  }

  const frontendState = mapBackendStatusToFrontendState(order.status);
  const stateHandler = getOrderStateHandler(frontendState);
  const stateColors = orderStateColors[frontendState] || orderStateColors.pending;

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

  const handleDownloadDocument = (doc: LiasseDocument) => {
    let blob: Blob;
    let filename: string;
    let mimeType: string;

    if (doc.format === 'pdf') {
      mimeType = 'application/pdf';
      filename = `${doc.type}.pdf`;
      // doc.content is Base64 encoded PDF string, decode it
      const byteCharacters = atob(doc.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: mimeType });
    } else { // html
      mimeType = 'text/html';
      filename = `${doc.type}.html`;
      blob = new Blob([doc.content], { type: mimeType });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const documentTitles = [
    "Demande d'Immatriculation",
    "Certificat de Cession",
    "Bon de Commande",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4"><CheckCircle2 className="h-8 w-8 text-green-500" /></div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Commande Confirmée</h1>
              <p className="text-muted-foreground">Référence: <span className="font-mono font-bold text-foreground">CMD-{order.id}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold">État de la Commande</h2>
                      <div className="mt-2 mb-6">
                         <OrderProgressBar currentState={frontendState} />
                         <div className="flex flex-wrap gap-3 mt-4">
                           {order.status === 'EN_COURS' && (
                            <>
                              <Button onClick={() => updateState({ newStatus: 'valider' })} disabled={isUpdatingState}>
                                {isUpdatingState && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Valider la commande
                              </Button>
                              {order.typeCommande === 'Crédit' && (
                                <Button onClick={() => updateState({ newStatus: 'approuver-credit' })} disabled={isUpdatingState}>
                                {isUpdatingState && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Approuver le crédit
                              </Button>
                              )}
                            </>
                           )}
                         </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Articles Commandés</h2>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.vehicule.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg items-center">
                            <div className="flex-1">
                              <p className="font-semibold">{item.vehicule.brand} {item.vehicule.name}</p>
                              <p className="text-sm text-muted-foreground">{item.quantity} x {formatPrice(item.vehicule.basePrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Documents</h2>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="document-format">Format:</Label>
                                <Select onValueChange={(value: DocumentFormat) => setSelectedFormat(value)} defaultValue={selectedFormat}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="html">HTML</SelectItem>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => generateDocs()} disabled={isGeneratingDocs}>
                                    {isGeneratingDocs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                    Générer la liasse de documents
                                </Button>
                            </div>
                        </div>
                        {generatedLiasse && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {generatedLiasse.documents.map((doc, index) => (
                                <div key={doc.type} className="p-4 bg-muted/50 rounded-lg border">
                                <p key={doc.type} className="font-bold text-base mb-2">{documentTitles[index]}</p>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => setPreviewDocument(doc)}><Eye className="h-3 w-3 mr-1" />Voir</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}><Download className="h-3 w-3 mr-1" />Télécharger</Button>
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card className="p-6 sticky top-24">
                    <h2 className="text-lg font-semibold mb-4">Résumé</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDate(order.dateCommande)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pays</span><span>{order.paysLivraison}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Paiement</span><span>{order.typeCommande}</span></div>
                    </div>
                    <div className="mt-6 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total TTC</span><span className="text-gradient-gold">{formatPrice(order.montantTotal)}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/mes-commandes')}>Voir toutes mes commandes</Button>
                  </Card>
                </div>
            </div>
        </div>
      </main>

      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader><DialogTitle>{previewDocument && documentTitles[generatedLiasse.documents.indexOf(previewDocument)]}</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-auto bg-white rounded-lg">
            {previewDocument && (
                previewDocument.format === 'pdf' ? (
                    <iframe src={`data:application/pdf;base64,${previewDocument.content}`} className="w-full h-[70vh] border-0" title={previewDocument.type} type="application/pdf" />
                ) : (
                    <iframe srcDoc={previewDocument.content} className="w-full h-[70vh] border-0" title={previewDocument.type} />
                )
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>Fermer</Button>
            {previewDocument && <Button variant="hero" onClick={() => handleDownloadDocument(previewDocument)}><Download className="h-4 w-4 mr-2" />Télécharger</Button>}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
