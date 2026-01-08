// Strategy Pattern: Payment method handling

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface PaymentStrategy {
  type: 'cash' | 'credit';
  name: string;
  description: string;
  processPayment(amount: number): Promise<PaymentResult>;
  validatePayment(): boolean;
}

// Concrete Strategy: Cash payment
export class CashPaymentStrategy implements PaymentStrategy {
  type: 'cash' = 'cash';
  name = 'Paiement Comptant';
  description = 'Paiement intégral à la commande';
  
  async processPayment(amount: number): Promise<PaymentResult> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      transactionId: `CASH-${Date.now()}`,
      message: `Paiement comptant de ${amount.toFixed(2)}€ accepté`,
    };
  }
  
  validatePayment(): boolean {
    return true; // Cash is always valid
  }
}

// Credit request details
export interface CreditDetails {
  monthlyPayment: number;
  duration: number; // in months
  interestRate: number;
  totalAmount: number;
  downPayment: number;
}

// Concrete Strategy: Credit payment
export class CreditPaymentStrategy implements PaymentStrategy {
  type: 'credit' = 'credit';
  name = 'Demande de Crédit';
  description = 'Financement en plusieurs mensualités';
  
  private creditDetails: CreditDetails | null = null;
  
  setCreditDetails(details: CreditDetails) {
    this.creditDetails = details;
  }
  
  getCreditDetails(): CreditDetails | null {
    return this.creditDetails;
  }
  
  calculateCredit(amount: number, duration: number, downPayment: number = 0): CreditDetails {
    const interestRate = this.getInterestRate(duration);
    const financeAmount = amount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly payment using amortization formula
    const monthlyPayment = financeAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
      (Math.pow(1 + monthlyRate, duration) - 1);
    
    const totalAmount = monthlyPayment * duration + downPayment;
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      duration,
      interestRate,
      totalAmount: Math.round(totalAmount * 100) / 100,
      downPayment,
    };
  }
  
  private getInterestRate(duration: number): number {
    // Interest rate varies by duration
    if (duration <= 12) return 3.9;
    if (duration <= 24) return 4.5;
    if (duration <= 36) return 5.2;
    if (duration <= 48) return 5.9;
    return 6.5;
  }
  
  async processPayment(amount: number): Promise<PaymentResult> {
    if (!this.creditDetails) {
      return {
        success: false,
        message: 'Veuillez configurer les détails du crédit',
      };
    }
    
    // Simulate credit application processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      transactionId: `CREDIT-${Date.now()}`,
      message: `Demande de crédit acceptée: ${this.creditDetails.monthlyPayment}€/mois sur ${this.creditDetails.duration} mois`,
    };
  }
  
  validatePayment(): boolean {
    return this.creditDetails !== null && 
           this.creditDetails.duration > 0 && 
           this.creditDetails.monthlyPayment > 0;
  }
}

// Available credit durations
export const creditDurations = [12, 24, 36, 48, 60];

// Factory to create payment strategies
export const createPaymentStrategy = (type: 'cash' | 'credit'): PaymentStrategy => {
  switch (type) {
    case 'cash':
      return new CashPaymentStrategy();
    case 'credit':
      return new CreditPaymentStrategy();
    default:
      return new CashPaymentStrategy();
  }
};
