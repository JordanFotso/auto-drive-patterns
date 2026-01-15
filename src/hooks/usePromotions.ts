import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@/types/vehicle';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchPromotions = async (): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/api/vehicules/promotions`);
  if (!response.ok) {
    throw new Error('Failed to fetch promotions');
  }
  const data: Vehicle[] = await response.json();
  
  // Mapper les données de l'API pour correspondre au type Vehicle du frontend
  return data.map(vehicle => ({
    ...vehicle,
    id: String(vehicle.id), // Convertir Long (number) en string
    inStockSince: new Date(vehicle.inStockSince), // Convertir string en Date
    // Assurez-vous que les spécifications sont correctement mappées
    specifications: {
      engine: vehicle.specifications?.engine || '',
      power: vehicle.specifications?.power || '',
      acceleration: vehicle.specifications?.acceleration || '',
      topSpeed: vehicle.specifications?.topSpeed || '',
    },
    // Gérer availableOptions si elles sont nulles ou non définies
    availableOptions: vehicle.availableOptions || [],
    isOnSale: vehicle.onSale || false, // Ensure isOnSale is explicitly carried over or defaults to false
    saleDiscount: vehicle.saleDiscount || 0, // Ensure saleDiscount is explicitly carried over or defaults to 0
  }));
};

export const usePromotions = () => {
  return useQuery<Vehicle[], Error>({
    queryKey: ['promotions'],
    queryFn: fetchPromotions,
  });
};