import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/context/OrderContext';
import { getOrderStateHandler, orderStateColors } from '@/patterns/state/OrderState';
import { OrderDocument } from '@/patterns/builder/DocumentBuilder';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderState, generateDocuments } = useOrder();
  
  const [documents, setDocuments] = useState<OrderDocument[]>([]);
  const [previewDocument, setPreviewDocument] = useState<OrderDocument | null>(null);
  
  const order = getOrderById(id || '');
  
  useEffect(() => {
    if (order && documents.length === 0) {
      const docs = generateDocuments(order.id);
      setDocuments(docs);
    }
  }, [order, documents.length, generateDocuments]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
            <Button variant="hero" onClick={() => navigate('/catalogue')}>
              Retour au catalogue
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stateHandler = getOrderStateHandler(order.state);
  const stateColors = orderStateColors[order.state];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleDownloadDocument = (doc: OrderDocument) => {
    const blob = new Blob([doc.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleValidateOrder = () => {
    updateOrderState(order.id, 'validated');
  };

  const handleMarkDelivered = () => {
    updateOrderState(order.id, 'delivered');
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return '📋';
      case 'certificate':
        return '📜';
      case 'order':
        return '🧾';
      default:
        return '📄';
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'registration':
        return "Demande d'Immatriculation";
      case 'certificate':
        return 'Certificat de Cession';
      case 'order':
        return 'Bon de Commande';
      default:
        return 'Document';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Commande Confirmée
            </h1>
            <p className="text-muted-foreground">
              Référence: <span className="font-mono font-bold text-foreground">{order.id}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">État de la Commande</h2>
                  <Badge className={`${stateColors.bg} ${stateColors.text}`}>
                    {stateHandler.label}
                  </Badge>
                </div>

                {/* State Progress */}
                <div className="flex items-center justify-between mb-6">
                  {['pending', 'validated', 'delivered'].map((state, index) => {
                    const isActive = order.state === state;
                    const isPast = 
                      (state === 'pending') ||
                      (state === 'validated' && (order.state === 'validated' || order.state === 'delivered')) ||
                      (state === 'delivered' && order.state === 'delivered');
                    
                    const Icon = state === 'pending' ? Clock : state === 'validated' ? CheckCircle2 : Truck;
                    
                    return (
                      <div key={state} className="flex items-center">
                        <div className={`flex flex-col items-center ${index < 2 ? 'flex-1' : ''}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isPast ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs mt-2 ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {state === 'pending' ? 'En cours' : state === 'validated' ? 'Validée' : 'Livrée'}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className={`flex-1 h-1 mx-2 rounded ${
                            (state === 'pending' && order.state !== 'pending') ||
                            (state === 'validated' && order.state === 'delivered')
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {order.state === 'pending' && (
                    <Button variant="hero" onClick={handleValidateOrder}>
                      Valider la commande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  {order.state === 'validated' && (
                    <Button variant="hero" onClick={handleMarkDelivered}>
                      Marquer comme livrée
                      <Truck className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>

              {/* Items */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Articles Commandés</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.vehicle.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.vehicle.brand}</p>
                        <p className="font-semibold">{item.vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">{item.vehicle.model} ({item.vehicle.year})</p>
                        {item.selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.selectedOptions.map((opt) => (
                              <Badge key={opt.id} variant="outline" className="text-xs">
                                {opt.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                        <p className="font-semibold">
                          {formatPrice(
                            ((item.vehicle.isOnSale && item.vehicle.saleDiscount
                              ? item.vehicle.basePrice * (1 - item.vehicle.saleDiscount / 100)
                              : item.vehicle.basePrice) +
                              item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) *
                            item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Documents */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Documents</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div 
                      key={doc.type}
                      className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="text-3xl mb-2">{getDocumentIcon(doc.type)}</div>
                      <p className="font-medium text-sm">{getDocumentTitle(doc.type)}</p>
                      <p className="text-xs text-muted-foreground mb-3">Format {doc.format.toUpperCase()}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPreviewDocument(doc)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Résumé</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pays</span>
                    <span>{order.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paiement</span>
                    <span>{order.paymentMethod === 'cash' ? 'Comptant' : 'Crédit'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span>{formatPrice(order.totalAmount - order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>{formatPrice(order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total TTC</span>
                    <span className="text-gradient-gold">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => navigate('/mes-commandes')}
                >
                  Voir toutes mes commandes
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-white rounded-lg">
            {previewDocument && (
              <iframe
                srcDoc={previewDocument.content}
                className="w-full h-[70vh] border-0"
                title={previewDocument.title}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Fermer
            </Button>
            {previewDocument && (
              <Button variant="hero" onClick={() => handleDownloadDocument(previewDocument)}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
