// State Pattern: Order state management

import { Order, OrderState as OrderStateType } from '@/types/vehicle';

export interface OrderStateHandler {
  state: OrderStateType;
  label: string;
  description: string;
  canTransitionTo(nextState: OrderStateType): boolean;
  getNextStates(): OrderStateType[];
  getActions(): string[];
}

// Concrete State: Pending
export class PendingState implements OrderStateHandler {
  state: OrderStateType = 'pending';
  label = 'En cours';
  description = 'La commande est en attente de validation';
  
  canTransitionTo(nextState: OrderStateType): boolean {
    return nextState === 'validated';
  }
  
  getNextStates(): OrderStateType[] {
    return ['validated'];
  }
  
  getActions(): string[] {
    return ['Valider la commande', 'Annuler la commande'];
  }
}

// Concrete State: Validated
export class ValidatedState implements OrderStateHandler {
  state: OrderStateType = 'validated';
  label = 'Validée';
  description = 'La commande a été validée et est en préparation';
  
  canTransitionTo(nextState: OrderStateType): boolean {
    return nextState === 'delivered';
  }
  
  getNextStates(): OrderStateType[] {
    return ['delivered'];
  }
  
  getActions(): string[] {
    return ['Marquer comme livrée', 'Générer les documents'];
  }
}

// Concrete State: Delivered
export class DeliveredState implements OrderStateHandler {
  state: OrderStateType = 'delivered';
  label = 'Livrée';
  description = 'La commande a été livrée au client';
  
  canTransitionTo(nextState: OrderStateType): boolean {
    return false; // Final state
  }
  
  getNextStates(): OrderStateType[] {
    return [];
  }
  
  getActions(): string[] {
    return ['Télécharger les documents', 'Voir le récapitulatif'];
  }
}

// State factory
export const getOrderStateHandler = (state: OrderStateType): OrderStateHandler => {
  switch (state) {
    case 'pending':
      return new PendingState();
    case 'validated':
      return new ValidatedState();
    case 'delivered':
      return new DeliveredState();
    default:
      return new PendingState();
  }
};

// State transition manager
export class OrderStateMachine {
  private order: Order;
  private stateHandler: OrderStateHandler;
  
  constructor(order: Order) {
    this.order = order;
    this.stateHandler = getOrderStateHandler(order.state);
  }
  
  getState(): OrderStateType {
    return this.order.state;
  }
  
  getStateHandler(): OrderStateHandler {
    return this.stateHandler;
  }
  
  canTransitionTo(nextState: OrderStateType): boolean {
    return this.stateHandler.canTransitionTo(nextState);
  }
  
  transitionTo(nextState: OrderStateType): boolean {
    if (!this.canTransitionTo(nextState)) {
      console.error(`Cannot transition from ${this.order.state} to ${nextState}`);
      return false;
    }
    
    this.order.state = nextState;
    this.order.updatedAt = new Date();
    this.stateHandler = getOrderStateHandler(nextState);
    
    return true;
  }
  
  getOrder(): Order {
    return this.order;
  }
}

// Order state colors for UI
export const orderStateColors: Record<OrderStateType, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500' },
  validated: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
  delivered: { bg: 'bg-green-500/20', text: 'text-green-500' },
};
