import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, CartMemento, Vehicle, VehicleOption } from '@/types/vehicle';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  history: CartMemento[];
  currentHistoryIndex: number;
  addToCart: (vehicle: Vehicle, options: VehicleOption[]) => void;
  removeFromCart: (vehicleId: string) => void;
  updateItemOptions: (vehicleId: string, options: VehicleOption[]) => void;
  clearCart: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<CartMemento[]>([{ items: [], timestamp: new Date() }]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Memento pattern: save current state to history
  const saveToHistory = useCallback((newItems: CartItem[]) => {
    const newMemento: CartMemento = {
      items: JSON.parse(JSON.stringify(newItems)),
      timestamp: new Date(),
    };
    
    // Remove any future states if we're not at the end
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newMemento);
    
    // Keep only last 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const addToCart = useCallback((vehicle: Vehicle, options: VehicleOption[]) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.vehicle.id === vehicle.id);
      let newItems: CartItem[];
      
      if (existingIndex >= 0) {
        newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          selectedOptions: options,
          quantity: newItems[existingIndex].quantity + 1,
        };
      } else {
        newItems = [...prev, { vehicle, selectedOptions: options, quantity: 1 }];
      }
      
      saveToHistory(newItems);
      return newItems;
    });
    toast.success(`${vehicle.name} ajouté au panier`);
  }, [saveToHistory]);

  const removeFromCart = useCallback((vehicleId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.vehicle.id !== vehicleId);
      saveToHistory(newItems);
      return newItems;
    });
    toast.success('Article retiré du panier');
  }, [saveToHistory]);

  const updateItemOptions = useCallback((vehicleId: string, options: VehicleOption[]) => {
    setItems(prev => {
      const newItems = prev.map(item =>
        item.vehicle.id === vehicleId
          ? { ...item, selectedOptions: options }
          : item
      );
      saveToHistory(newItems);
      return newItems;
    });
  }, [saveToHistory]);

  const clearCart = useCallback(() => {
    saveToHistory([]);
    setItems([]);
    toast.success('Panier vidé');
  }, [saveToHistory]);

  // Memento pattern: restore previous state
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
        ? item.vehicle.basePrice * (1 - item.vehicle.saleDiscount / 100)
        : item.vehicle.basePrice;
      
      const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      
      return total + (vehiclePrice + optionsPrice) * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        history,
        currentHistoryIndex,
        addToCart,
        removeFromCart,
        updateItemOptions,
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
