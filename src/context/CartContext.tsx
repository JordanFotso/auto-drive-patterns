import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, CartMemento, Vehicle, VehicleOption } from '@/types/vehicle';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (vehicle: Vehicle, options: VehicleOption[]) => void;
  removeFromCart: (vehicleId: string) => void;
  incrementQuantity: (vehicleId: string) => void;
  decrementQuantity: (vehicleId: string) => void;
  clearCart: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vehiclub_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      return [];
    }
  });

  const [history, setHistory] = useState<CartMemento[]>([{ items, timestamp: new Date() }]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [items]);

  const updateStateAndHistory = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    const newMemento: CartMemento = { items: JSON.parse(JSON.stringify(newItems)), timestamp: new Date() };
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newMemento);
    setHistory(newHistory.slice(-20)); // Keep last 20 states
    setCurrentHistoryIndex(newHistory.slice(-20).length - 1);
  }, [history, currentHistoryIndex]);

  const addToCart = useCallback((vehicle: Vehicle, options: VehicleOption[]) => {
    const existingIndex = items.findIndex(item => item.vehicle.id === vehicle.id);
    let newItems: CartItem[];

    if (existingIndex >= 0) {
      newItems = [...items];
      newItems[existingIndex].quantity += 1;
    } else {
      newItems = [...items, { vehicle, selectedOptions: options, quantity: 1 }];
    }
    
    updateStateAndHistory(newItems);
    toast.success(`${vehicle.name} ajouté au panier`);
  }, [items, updateStateAndHistory]);

  const removeFromCart = useCallback((vehicleId: string) => {
    const newItems = items.filter(item => item.vehicle.id !== vehicleId);
    updateStateAndHistory(newItems);
    toast.success('Article retiré du panier');
  }, [items, updateStateAndHistory]);

  const incrementQuantity = useCallback((vehicleId: string) => {
    const newItems = items.map(item =>
      item.vehicle.id === vehicleId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateStateAndHistory(newItems);
  }, [items, updateStateAndHistory]);

  const decrementQuantity = useCallback((vehicleId: string) => {
    const newItems = items.map(item =>
      item.vehicle.id === vehicleId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0); // Remove if quantity becomes 0
    updateStateAndHistory(newItems);
  }, [items, updateStateAndHistory]);
  
  const clearCart = useCallback(() => {
    updateStateAndHistory([]);
    toast.success('Panier vidé');
  }, [updateStateAndHistory]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setItems(JSON.parse(JSON.stringify(history[newIndex].items)));
      toast.info('Action annulée');
    }
  }, [currentHistoryIndex, history]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setItems(JSON.parse(JSON.stringify(history[newIndex].items)));
      toast.info('Action rétablie');
    }
  }, [currentHistoryIndex, history]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const vehiclePrice = item.vehicle.isOnSale && item.vehicle.saleDiscount
        ? item.vehicle.basePrice - item.vehicle.saleDiscount
        : item.vehicle.basePrice;
      
      const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      
      return total + (vehiclePrice + optionsPrice) * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        undo,
        redo,
        canUndo: currentHistoryIndex > 0,
        canRedo: currentHistoryIndex < history.length - 1,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
