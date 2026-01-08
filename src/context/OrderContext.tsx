import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, CartItem } from '@/types/vehicle';
import { TaxStrategy, getTaxStrategy } from '@/patterns/strategy/TaxStrategy';
import { PaymentStrategy, createPaymentStrategy, CreditPaymentStrategy } from '@/patterns/strategy/PaymentStrategy';
import { OrderStateMachine, getOrderStateHandler } from '@/patterns/state/OrderState';
import { generateOrderDocuments, OrderDocument } from '@/patterns/builder/DocumentBuilder';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  taxStrategy: TaxStrategy;
  paymentStrategy: PaymentStrategy;
  setTaxStrategy: (countryCode: string) => void;
  setPaymentStrategy: (type: 'cash' | 'credit') => void;
  createOrder: (items: CartItem[]) => Order;
  updateOrderState: (orderId: string, newState: 'pending' | 'validated' | 'delivered') => boolean;
  generateDocuments: (orderId: string) => OrderDocument[];
  calculateTax: (amount: number) => number;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [taxStrategy, setTaxStrategyState] = useState<TaxStrategy>(getTaxStrategy('FR'));
  const [paymentStrategy, setPaymentStrategyState] = useState<PaymentStrategy>(createPaymentStrategy('cash'));

  const setTaxStrategy = useCallback((countryCode: string) => {
    setTaxStrategyState(getTaxStrategy(countryCode));
  }, []);

  const setPaymentStrategy = useCallback((type: 'cash' | 'credit') => {
    setPaymentStrategyState(createPaymentStrategy(type));
  }, []);

  const calculateTax = useCallback((amount: number) => {
    return taxStrategy.calculateTax(amount);
  }, [taxStrategy]);

  const createOrder = useCallback((items: CartItem[]): Order => {
    // Calculate base total
    const baseTotal = items.reduce((total, item) => {
      const vehiclePrice = item.vehicle.isOnSale && item.vehicle.saleDiscount
        ? item.vehicle.basePrice * (1 - item.vehicle.saleDiscount / 100)
        : item.vehicle.basePrice;
      const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      return total + (vehiclePrice + optionsPrice) * item.quantity;
    }, 0);

    const taxAmount = taxStrategy.calculateTax(baseTotal);
    const totalAmount = baseTotal + taxAmount;

    const newOrder: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: JSON.parse(JSON.stringify(items)), // Deep copy
      state: 'pending',
      totalAmount,
      taxAmount,
      country: taxStrategy.countryName,
      paymentMethod: paymentStrategy.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);
    toast.success(`Commande ${newOrder.id} créée`);

    return newOrder;
  }, [taxStrategy, paymentStrategy]);

  const updateOrderState = useCallback((orderId: string, newState: 'pending' | 'validated' | 'delivered'): boolean => {
    let success = false;
    
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const stateMachine = new OrderStateMachine(order);
        if (stateMachine.canTransitionTo(newState)) {
          stateMachine.transitionTo(newState);
          success = true;
          const stateHandler = getOrderStateHandler(newState);
          toast.success(`Commande ${orderId}: ${stateHandler.label}`);
          return stateMachine.getOrder();
        } else {
          toast.error(`Transition impossible vers "${newState}"`);
        }
      }
      return order;
    }));

    return success;
  }, []);

  const generateDocuments = useCallback((orderId: string): OrderDocument[] => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Commande introuvable');
      return [];
    }

    const documents = generateOrderDocuments(order, 'html');
    toast.success(`${documents.length} documents générés`);
    return documents;
  }, [orders]);

  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        taxStrategy,
        paymentStrategy,
        setTaxStrategy,
        setPaymentStrategy,
        createOrder,
        updateOrderState,
        generateDocuments,
        calculateTax,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
