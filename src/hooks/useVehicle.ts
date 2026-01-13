import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@/types/vehicle';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await fetch(`${API_BASE_URL}/api/vehicules/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle');
  }
  const data: Vehicle = await response.json();
  
  // Mapper les données de l'API pour correspondre au type Vehicle du frontend
  return {
    ...data,
    id: String(data.id), // Convertir Long (number) en string
    inStockSince: new Date(data.inStockSince), // Convertir string en Date
    // Assurez-vous que les spécifications sont correctement mappées
    specifications: {
      engine: data.specifications?.engine || '',
      power: data.specifications?.power || '',
      acceleration: data.specifications?.acceleration || '',
      topSpeed: data.specifications?.topSpeed || '',
    },
    // Gérer availableOptions si elles sont nulles ou non définies
    availableOptions: data.availableOptions || [],
  };
};

export const useVehicle = (id: string) => {
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id),
    enabled: !!id, // N'activer la requête que si l'ID est disponible
  });
};
