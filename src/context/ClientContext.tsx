import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  ClientComponent, 
  IndividualClient, 
  CompanyClient, 
  createClient 
} from '@/patterns/composite/ClientComposite';
import { toast } from 'sonner';

interface FleetOrder {
  id: string;
  clientId: string;
  vehicleIds: string[];
  quantity: number;
  discount: number;
  totalAmount: number;
  createdAt: Date;
}

interface ClientContextType {
  clients: ClientComponent[];
  selectedClient: ClientComponent | null;
  fleetOrders: FleetOrder[];
  addIndividualClient: (name: string, email: string, phone: string) => ClientComponent;
  addCompanyClient: (name: string, email: string, siret: string, employees: number) => CompanyClient;
  addSubsidiary: (parentId: string, subsidiary: CompanyClient) => void;
  removeSubsidiary: (parentId: string, subsidiaryId: string) => void;
  selectClient: (clientId: string | null) => void;
  getClientById: (clientId: string) => ClientComponent | undefined;
  createFleetOrder: (clientId: string, vehicleIds: string[], quantity: number, baseAmount: number) => FleetOrder;
  getFleetOrdersByClient: (clientId: string) => FleetOrder[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<ClientComponent[]>(() => {
    // Données de démonstration
    const techCorp = new CompanyClient('company-1', 'TechCorp International', 'contact@techcorp.com', '12345678901234', 500);
    const techCorpFrance = new CompanyClient('company-2', 'TechCorp France', 'france@techcorp.com', '23456789012345', 150);
    const techCorpLyon = new CompanyClient('company-3', 'TechCorp Lyon', 'lyon@techcorp.com', '34567890123456', 50);
    
    techCorpFrance.addSubsidiary(techCorpLyon);
    techCorp.addSubsidiary(techCorpFrance);

    const autoFleet = new CompanyClient('company-4', 'AutoFleet Services', 'info@autofleet.fr', '45678901234567', 75);
    
    const individual = new IndividualClient('individual-1', 'Jean Dupont', 'jean.dupont@email.com', '0612345678');

    return [techCorp, autoFleet, individual];
  });

  const [selectedClient, setSelectedClient] = useState<ClientComponent | null>(null);
  const [fleetOrders, setFleetOrders] = useState<FleetOrder[]>([]);

  const generateId = () => `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addIndividualClient = useCallback((name: string, email: string, phone: string): ClientComponent => {
    const client = createClient('individual', {
      id: generateId(),
      name,
      email,
      phone,
    });
    setClients(prev => [...prev, client]);
    toast.success(`Client "${name}" ajouté`);
    return client;
  }, []);

  const addCompanyClient = useCallback((
    name: string,
    email: string,
    siret: string,
    employees: number
  ): CompanyClient => {
    const company = new CompanyClient(generateId(), name, email, siret, employees);
    setClients(prev => [...prev, company]);
    toast.success(`Société "${name}" ajoutée`);
    return company;
  }, []);

  const findCompanyInList = (clients: ClientComponent[], id: string): CompanyClient | undefined => {
    for (const client of clients) {
      if (client.id === id && client.getType() === 'company') {
        return client as CompanyClient;
      }
      if (client.getType() === 'company') {
        const company = client as CompanyClient;
        const found = findCompanyInList(company.getSubsidiaries(), id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const addSubsidiary = useCallback((parentId: string, subsidiary: CompanyClient) => {
    const parent = findCompanyInList(clients, parentId);
    if (parent) {
      parent.addSubsidiary(subsidiary);
      setClients([...clients]); // Trigger re-render
      toast.success(`Filiale "${subsidiary.name}" ajoutée à "${parent.name}"`);
    }
  }, [clients]);

  const removeSubsidiary = useCallback((parentId: string, subsidiaryId: string) => {
    const parent = findCompanyInList(clients, parentId);
    if (parent) {
      parent.removeSubsidiary(subsidiaryId);
      setClients([...clients]);
      toast.success('Filiale retirée');
    }
  }, [clients]);

  const selectClient = useCallback((clientId: string | null) => {
    if (!clientId) {
      setSelectedClient(null);
      return;
    }
    const client = findClientById(clients, clientId);
    setSelectedClient(client || null);
  }, [clients]);

  const findClientById = (clients: ClientComponent[], id: string): ClientComponent | undefined => {
    for (const client of clients) {
      if (client.id === id) return client;
      if (client.getType() === 'company') {
        const company = client as CompanyClient;
        const found = findClientById(company.getSubsidiaries(), id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const getClientById = useCallback((clientId: string): ClientComponent | undefined => {
    return findClientById(clients, clientId);
  }, [clients]);

  const createFleetOrder = useCallback((
    clientId: string,
    vehicleIds: string[],
    quantity: number,
    baseAmount: number
  ): FleetOrder => {
    const client = findClientById(clients, clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const discount = client.getFleetDiscount();
    const discountedAmount = baseAmount * (1 - discount / 100);

    const order: FleetOrder = {
      id: `fleet-${Date.now()}`,
      clientId,
      vehicleIds,
      quantity,
      discount,
      totalAmount: discountedAmount,
      createdAt: new Date(),
    };

    setFleetOrders(prev => [...prev, order]);
    toast.success(`Commande flotte créée avec ${discount}% de remise`);
    return order;
  }, [clients]);

  const getFleetOrdersByClient = useCallback((clientId: string): FleetOrder[] => {
    return fleetOrders.filter(order => order.clientId === clientId);
  }, [fleetOrders]);

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        fleetOrders,
        addIndividualClient,
        addCompanyClient,
        addSubsidiary,
        removeSubsidiary,
        selectClient,
        getClientById,
        createFleetOrder,
        getFleetOrdersByClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
