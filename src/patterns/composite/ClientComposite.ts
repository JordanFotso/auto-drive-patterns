// Composite Pattern - Gestion des clients et sociétés avec filiales

export interface ClientComponent {
  id: string;
  name: string;
  email: string;
  getType(): 'individual' | 'company';
  getTotalEmployees(): number;
  getFleetDiscount(): number;
  getAllClients(): ClientComponent[];
}

// Leaf - Client individuel
export class IndividualClient implements ClientComponent {
  id: string;
  name: string;
  email: string;
  phone: string;

  constructor(id: string, name: string, email: string, phone: string = '') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  getType(): 'individual' {
    return 'individual';
  }

  getTotalEmployees(): number {
    return 1;
  }

  getFleetDiscount(): number {
    return 0; // Pas de remise flotte pour les particuliers
  }

  getAllClients(): ClientComponent[] {
    return [this];
  }
}

// Composite - Société avec filiales
export class CompanyClient implements ClientComponent {
  id: string;
  name: string;
  email: string;
  siret: string;
  employees: number;
  private subsidiaries: CompanyClient[] = [];
  parentCompany?: CompanyClient;

  constructor(
    id: string,
    name: string,
    email: string,
    siret: string,
    employees: number = 1
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.siret = siret;
    this.employees = employees;
  }

  getType(): 'company' {
    return 'company';
  }

  // Ajouter une filiale
  addSubsidiary(subsidiary: CompanyClient): void {
    subsidiary.parentCompany = this;
    this.subsidiaries.push(subsidiary);
  }

  // Retirer une filiale
  removeSubsidiary(subsidiaryId: string): void {
    const index = this.subsidiaries.findIndex(s => s.id === subsidiaryId);
    if (index >= 0) {
      this.subsidiaries[index].parentCompany = undefined;
      this.subsidiaries.splice(index, 1);
    }
  }

  getSubsidiaries(): CompanyClient[] {
    return this.subsidiaries;
  }

  // Calcul récursif du nombre total d'employés (société + filiales)
  getTotalEmployees(): number {
    return this.employees + this.subsidiaries.reduce(
      (sum, subsidiary) => sum + subsidiary.getTotalEmployees(),
      0
    );
  }

  // Remise flotte basée sur le nombre total d'employés du groupe
  getFleetDiscount(): number {
    const totalEmployees = this.getTotalEmployees();
    
    if (totalEmployees >= 1000) return 15; // 15% pour les très grands groupes
    if (totalEmployees >= 500) return 12;  // 12% pour les grands groupes
    if (totalEmployees >= 100) return 8;   // 8% pour les moyennes entreprises
    if (totalEmployees >= 50) return 5;    // 5% pour les petites entreprises
    if (totalEmployees >= 10) return 3;    // 3% pour les TPE
    return 0;
  }

  // Obtenir tous les clients du groupe (récursif)
  getAllClients(): ClientComponent[] {
    const clients: ClientComponent[] = [this];
    this.subsidiaries.forEach(subsidiary => {
      clients.push(...subsidiary.getAllClients());
    });
    return clients;
  }

  // Vérifier si une société est une filiale directe ou indirecte
  hasSubsidiary(companyId: string): boolean {
    if (this.subsidiaries.some(s => s.id === companyId)) {
      return true;
    }
    return this.subsidiaries.some(s => s.hasSubsidiary(companyId));
  }
}

// Factory pour créer des clients
export const createClient = (
  type: 'individual' | 'company',
  data: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    siret?: string;
    employees?: number;
  }
): ClientComponent => {
  if (type === 'individual') {
    return new IndividualClient(data.id, data.name, data.email, data.phone || '');
  }
  return new CompanyClient(
    data.id,
    data.name,
    data.email,
    data.siret || '',
    data.employees || 1
  );
};
