export type VehicleType = 'automobile' | 'scooter';

export interface VehicleOption {
  id: string;
  name: string;
  price: number;
  category: string;
  incompatibleWith: string[]; // IDs of incompatible options
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  description: string;
  image: string;
  specifications: {
    engine: string;
    power: string;
    acceleration: string;
    topSpeed: string;
  };
  availableOptions: VehicleOption[];
  inStockSince: Date;
  isOnSale: boolean;
  saleDiscount?: number;
}

export interface CartItem {
  vehicle: Vehicle;
  selectedOptions: VehicleOption[];
  quantity: number;
}

// Memento pattern for cart state
export interface CartMemento {
  items: CartItem[];
  timestamp: Date;
}

// State pattern for orders
export type OrderState = 'pending' | 'validated' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  state: OrderState;
  totalAmount: number;
  taxAmount: number;
  country: string;
  paymentMethod: 'cash' | 'credit';
  createdAt: Date;
  updatedAt: Date;
}

// Composite pattern for company/subsidiary structure
export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'company';
}

export interface Company extends Client {
  type: 'company';
  subsidiaries: Company[];
  parentCompany?: string;
}
