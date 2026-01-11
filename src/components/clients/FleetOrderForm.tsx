import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Car, Truck, Calculator } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { ClientComponent } from '@/patterns/composite/ClientComposite';
import { useClients } from '@/context/ClientContext';
import { toast } from 'sonner';

interface FleetOrderFormProps {
  client: ClientComponent;
  onOrderCreated?: () => void;
}

const FleetOrderForm = ({ client, onOrderCreated }: FleetOrderFormProps) => {
  const { createFleetOrder } = useClients();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const fleetDiscount = client.getFleetDiscount();

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        const newQuantities = { ...quantities };
        delete newQuantities[vehicleId];
        setQuantities(newQuantities);
        return prev.filter(id => id !== vehicleId);
      }
      setQuantities(prev => ({ ...prev, [vehicleId]: 1 }));
      return [...prev, vehicleId];
    });
  };

  const handleQuantityChange = (vehicleId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [vehicleId]: Math.max(1, qty) }));
  };

  const calculateSubtotal = () => {
    return selectedVehicles.reduce((sum, vehicleId) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      const qty = quantities[vehicleId] || 1;
      return sum + (vehicle?.basePrice || 0) * qty;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (1 - fleetDiscount / 100);
  };

  const totalQuantity = selectedVehicles.reduce(
    (sum, id) => sum + (quantities[id] || 1),
    0
  );

  const handleSubmit = () => {
    if (selectedVehicles.length === 0) {
      toast.error('Veuillez sélectionner au moins un véhicule');
      return;
    }

    createFleetOrder(
      client.id,
      selectedVehicles,
      totalQuantity,
      calculateSubtotal()
    );

    setSelectedVehicles([]);
    setQuantities({});
    onOrderCreated?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-gold" />
          Commander une flotte
        </CardTitle>
        {fleetDiscount > 0 && (
          <Badge className="w-fit bg-green-500/20 text-green-400 border-green-500/30">
            Remise flotte: -{fleetDiscount}%
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle selection */}
        <div className="space-y-3">
          <Label>Sélectionnez les véhicules</Label>
          <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  selectedVehicles.includes(vehicle.id)
                    ? 'border-gold/50 bg-gold/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Checkbox
                  id={vehicle.id}
                  checked={selectedVehicles.includes(vehicle.id)}
                  onCheckedChange={() => handleVehicleToggle(vehicle.id)}
                />
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{vehicle.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.basePrice.toLocaleString('fr-FR')} €
                  </p>
                </div>
                {selectedVehicles.includes(vehicle.id) && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`qty-${vehicle.id}`} className="text-sm">
                      Qté:
                    </Label>
                    <Input
                      id={`qty-${vehicle.id}`}
                      type="number"
                      min="1"
                      value={quantities[vehicle.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(vehicle.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedVehicles.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Calculator className="h-5 w-5" />
              Récapitulatif
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre de véhicules:</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total:</span>
                <span>{calculateSubtotal().toLocaleString('fr-FR')} €</span>
              </div>
              {fleetDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Remise flotte ({fleetDiscount}%):</span>
                  <span>
                    -{(calculateSubtotal() * fleetDiscount / 100).toLocaleString('fr-FR')} €
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total:</span>
                <span className="text-gold">{calculateTotal().toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={selectedVehicles.length === 0}
          className="w-full bg-gold hover:bg-gold/90 text-primary"
        >
          <Car className="h-4 w-4 mr-2" />
          Commander la flotte
        </Button>
      </CardContent>
    </Card>
  );
};

export default FleetOrderForm;
