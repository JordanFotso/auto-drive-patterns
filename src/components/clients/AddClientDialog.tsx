import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User } from 'lucide-react';
import { useClients } from '@/context/ClientContext';
import { CompanyClient } from '@/patterns/composite/ClientComposite';

interface AddClientDialogProps {
  open: boolean;
  onClose: () => void;
  parentCompanyId?: string;
}

const AddClientDialog = ({ open, onClose, parentCompanyId }: AddClientDialogProps) => {
  const { addIndividualClient, addCompanyClient, addSubsidiary } = useClients();
  const [activeTab, setActiveTab] = useState<'individual' | 'company'>(
    parentCompanyId ? 'company' : 'individual'
  );

  // Individual form state
  const [individualName, setIndividualName] = useState('');
  const [individualEmail, setIndividualEmail] = useState('');
  const [individualPhone, setIndividualPhone] = useState('');

  // Company form state
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companySiret, setCompanySiret] = useState('');
  const [companyEmployees, setCompanyEmployees] = useState('10');

  const resetForm = () => {
    setIndividualName('');
    setIndividualEmail('');
    setIndividualPhone('');
    setCompanyName('');
    setCompanyEmail('');
    setCompanySiret('');
    setCompanyEmployees('10');
  };

  const handleSubmitIndividual = (e: React.FormEvent) => {
    e.preventDefault();
    addIndividualClient(individualName, individualEmail, individualPhone);
    resetForm();
    onClose();
  };

  const handleSubmitCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const company = new CompanyClient(
      `company-${Date.now()}`,
      companyName,
      companyEmail,
      companySiret,
      parseInt(companyEmployees) || 1
    );

    if (parentCompanyId) {
      addSubsidiary(parentCompanyId, company);
    } else {
      addCompanyClient(companyName, companyEmail, companySiret, parseInt(companyEmployees) || 1);
    }
    
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {parentCompanyId ? 'Ajouter une filiale' : 'Nouveau client'}
          </DialogTitle>
        </DialogHeader>

        {parentCompanyId ? (
          <form onSubmit={handleSubmitCompany} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de la filiale</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de la société"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="contact@societe.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-siret">SIRET</Label>
              <Input
                id="company-siret"
                value={companySiret}
                onChange={(e) => setCompanySiret(e.target.value)}
                placeholder="12345678901234"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-employees">Nombre d'employés</Label>
              <Input
                id="company-employees"
                type="number"
                min="1"
                value={companyEmployees}
                onChange={(e) => setCompanyEmployees(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gold hover:bg-gold/90 text-primary">
                Ajouter
              </Button>
            </div>
          </form>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'individual' | 'company')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Particulier
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Société
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <form onSubmit={handleSubmitIndividual} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="individual-name">Nom complet</Label>
                  <Input
                    id="individual-name"
                    value={individualName}
                    onChange={(e) => setIndividualName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-email">Email</Label>
                  <Input
                    id="individual-email"
                    type="email"
                    value={individualEmail}
                    onChange={(e) => setIndividualEmail(e.target.value)}
                    placeholder="jean@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-phone">Téléphone</Label>
                  <Input
                    id="individual-phone"
                    value={individualPhone}
                    onChange={(e) => setIndividualPhone(e.target.value)}
                    placeholder="0612345678"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-gold hover:bg-gold/90 text-primary">
                    Ajouter
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="company">
              <form onSubmit={handleSubmitCompany} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name-2">Nom de la société</Label>
                  <Input
                    id="company-name-2"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nom de la société"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email-2">Email</Label>
                  <Input
                    id="company-email-2"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="contact@societe.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-siret-2">SIRET</Label>
                  <Input
                    id="company-siret-2"
                    value={companySiret}
                    onChange={(e) => setCompanySiret(e.target.value)}
                    placeholder="12345678901234"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-employees-2">Nombre d'employés</Label>
                  <Input
                    id="company-employees-2"
                    type="number"
                    min="1"
                    value={companyEmployees}
                    onChange={(e) => setCompanyEmployees(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-gold hover:bg-gold/90 text-primary">
                    Ajouter
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
