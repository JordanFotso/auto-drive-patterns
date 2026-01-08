import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { taxStrategies } from '@/patterns/strategy/TaxStrategy';
import { CreditPaymentStrategy, creditDurations } from '@/patterns/strategy/PaymentStrategy';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, MapPin, FileText, ArrowRight, Calculator } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { 
    taxStrategy, 
    paymentStrategy, 
    setTaxStrategy, 
    setPaymentStrategy, 
    createOrder, 
    calculateTax 
  } = useOrder();

  const [selectedCountry, setSelectedCountry] = useState(taxStrategy.countryCode);
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'credit'>(paymentStrategy.type);
  const [creditDuration, setCreditDuration] = useState(36);
  const [downPayment, setDownPayment] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const baseTotal = getTotalPrice();
  const taxAmount = calculateTax(baseTotal);
  const totalWithTax = baseTotal + taxAmount;

  // Calculate credit details if payment is credit
  const getCreditDetails = () => {
    if (selectedPayment !== 'credit') return null;
    const creditStrategy = new CreditPaymentStrategy();
    return creditStrategy.calculateCredit(totalWithTax, creditDuration, downPayment);
  };

  const creditDetails = getCreditDetails();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setTaxStrategy(countryCode);
  };

  const handlePaymentChange = (type: 'cash' | 'credit') => {
    setSelectedPayment(type);
    setPaymentStrategy(type);
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const order = createOrder(items);
      clearCart();
      navigate(`/commande/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <Button variant="hero" onClick={() => navigate('/catalogue')}>
              Parcourir le catalogue
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            Finaliser la Commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Country Selection */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Pays de Livraison</h2>
                </div>

                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxStrategies.map((strategy) => (
                      <SelectItem key={strategy.countryCode} value={strategy.countryCode}>
                        {strategy.countryName} (TVA {strategy.getTaxRate()}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-sm text-muted-foreground mt-3">
                  Les taxes seront calculées selon la réglementation de {taxStrategy.countryName} ({taxStrategy.getTaxRate()}%)
                </p>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Mode de Paiement</h2>
                </div>

                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(value) => handlePaymentChange(value as 'cash' | 'credit')}
                  className="space-y-4"
                >
                  {/* Cash Option */}
                  <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPayment === 'cash' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  }`}>
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Banknote className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Paiement Comptant</p>
                          <p className="text-sm text-muted-foreground">Règlement intégral à la commande</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Credit Option */}
                  <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPayment === 'credit' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  }`}>
                    <RadioGroupItem value="credit" id="credit" className="mt-1" />
                    <Label htmlFor="credit" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Calculator className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Demande de Crédit</p>
                          <p className="text-sm text-muted-foreground">Financement en plusieurs mensualités</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Credit Configuration */}
                {selectedPayment === 'credit' && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Durée du crédit: {creditDuration} mois
                      </Label>
                      <Select 
                        value={creditDuration.toString()} 
                        onValueChange={(v) => setCreditDuration(parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {creditDurations.map((duration) => (
                            <SelectItem key={duration} value={duration.toString()}>
                              {duration} mois
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Apport initial: {formatPrice(downPayment)}
                      </Label>
                      <Slider
                        value={[downPayment]}
                        onValueChange={([value]) => setDownPayment(value)}
                        max={totalWithTax * 0.5}
                        step={500}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum: {formatPrice(totalWithTax * 0.5)}
                      </p>
                    </div>

                    {creditDetails && (
                      <div className="pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Mensualité</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(creditDetails.monthlyPayment)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Taux annuel</p>
                            <p className="text-lg font-medium">{creditDetails.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Montant financé</p>
                            <p className="font-medium">{formatPrice(totalWithTax - downPayment)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Coût total du crédit</p>
                            <p className="font-medium">{formatPrice(creditDetails.totalAmount)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.vehicle.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.vehicle.name}
                        {item.quantity > 1 && ` (x${item.quantity})`}
                      </span>
                      <span className="text-foreground font-medium">
                        {formatPrice(
                          ((item.vehicle.isOnSale && item.vehicle.saleDiscount
                            ? item.vehicle.basePrice * (1 - item.vehicle.saleDiscount / 100)
                            : item.vehicle.basePrice) +
                            item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) *
                          item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span>{formatPrice(baseTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      TVA ({taxStrategy.countryName} - {taxStrategy.getTaxRate()}%)
                    </span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total TTC</span>
                    <span className="text-gradient-gold">{formatPrice(totalWithTax)}</span>
                  </div>
                </div>

                {/* Payment Summary */}
                {selectedPayment === 'credit' && creditDetails && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Crédit
                      </Badge>
                    </div>
                    <p className="text-sm">
                      <span className="font-bold text-lg">{formatPrice(creditDetails.monthlyPayment)}</span>
                      <span className="text-muted-foreground">/mois x {creditDuration} mois</span>
                    </p>
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full mt-6"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Traitement en cours...'
                  ) : (
                    <>
                      Confirmer la commande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Documents info */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Les documents seront générés après validation</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
