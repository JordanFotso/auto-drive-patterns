// Strategy Pattern: Tax calculation based on country

export interface TaxStrategy {
  countryCode: string;
  countryName: string;
  calculateTax(amount: number): number;
  getTaxRate(): number;
}

// Concrete Strategy: France
export class FranceTaxStrategy implements TaxStrategy {
  countryCode = 'FR';
  countryName = 'France';
  
  calculateTax(amount: number): number {
    return amount * 0.20; // 20% TVA
  }
  
  getTaxRate(): number {
    return 20;
  }
}

// Concrete Strategy: Germany
export class GermanyTaxStrategy implements TaxStrategy {
  countryCode = 'DE';
  countryName = 'Allemagne';
  
  calculateTax(amount: number): number {
    return amount * 0.19; // 19% MwSt
  }
  
  getTaxRate(): number {
    return 19;
  }
}

// Concrete Strategy: Belgium
export class BelgiumTaxStrategy implements TaxStrategy {
  countryCode = 'BE';
  countryName = 'Belgique';
  
  calculateTax(amount: number): number {
    return amount * 0.21; // 21% BTW
  }
  
  getTaxRate(): number {
    return 21;
  }
}

// Concrete Strategy: Switzerland
export class SwitzerlandTaxStrategy implements TaxStrategy {
  countryCode = 'CH';
  countryName = 'Suisse';
  
  calculateTax(amount: number): number {
    return amount * 0.077; // 7.7% TVA
  }
  
  getTaxRate(): number {
    return 7.7;
  }
}

// Concrete Strategy: Italy
export class ItalyTaxStrategy implements TaxStrategy {
  countryCode = 'IT';
  countryName = 'Italie';
  
  calculateTax(amount: number): number {
    return amount * 0.22; // 22% IVA
  }
  
  getTaxRate(): number {
    return 22;
  }
}

// Concrete Strategy: Spain
export class SpainTaxStrategy implements TaxStrategy {
  countryCode = 'ES';
  countryName = 'Espagne';
  
  calculateTax(amount: number): number {
    return amount * 0.21; // 21% IVA
  }
  
  getTaxRate(): number {
    return 21;
  }
}

// Factory to get the appropriate strategy
export const taxStrategies: TaxStrategy[] = [
  new FranceTaxStrategy(),
  new GermanyTaxStrategy(),
  new BelgiumTaxStrategy(),
  new SwitzerlandTaxStrategy(),
  new ItalyTaxStrategy(),
  new SpainTaxStrategy(),
];

export const getTaxStrategy = (countryCode: string): TaxStrategy => {
  const strategy = taxStrategies.find(s => s.countryCode === countryCode);
  return strategy || new FranceTaxStrategy(); // Default to France
};
