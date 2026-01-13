import { useQuery } from '@tanstack/react-query';
import { Vehicle, VehicleOption } from '@/types/vehicle';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/api/vehicules/catalogue`);
  if (!response.ok) {
    throw new Error('Failed to fetch vehicles');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await response.json();
  
  // Mapper les données de l'API pour correspondre au type Vehicle du frontend
  return data.map(v => ({
    id: String(v.id),
    name: v.name,
    type: v.type.toLowerCase(),
    brand: v.brand,
    model: v.model,
    year: v.year,
    basePrice: v.basePrice,
    description: v.description,
    image: v.image,
    specifications: {
      engine: v.specifications?.engine || '',
      power: v.specifications?.power || '',
      acceleration: v.specifications?.acceleration || '',
      topSpeed: v.specifications?.topSpeed || '',
    },
    availableOptions: (v.availableOptions || []).map((opt: any) => ({
      id: opt.id, // Utilise l'ID métier (string)
      name: opt.name,
      price: opt.price,
      category: opt.category,
      incompatibleWith: opt.incompatibleWith || [],
    })),
    inStockSince: new Date(v.inStockSince),
    isOnSale: v.onSale, // Utiliser 'onSale' qui est le nom de la propriété générée par Jackson
    saleDiscount: v.saleDiscount || 0,
  }));
};

export const useVehicles = () => {
  return useQuery<Vehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });
};
