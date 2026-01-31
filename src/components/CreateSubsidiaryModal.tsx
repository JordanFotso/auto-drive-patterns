import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom de la filiale doit contenir au moins 2 caractères.'),
});

interface CreateSubsidiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: number | null;
}

const CreateSubsidiaryModal: React.FC<CreateSubsidiaryModalProps> = ({ isOpen, onClose, parentId }) => {
  const { token, getUserProfile } = useAuth(); // Assuming getUserProfile can refresh the tree
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token || parentId === null) {
      toast.error("Erreur d'authentification ou parent non sélectionné.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/societes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nom: values.nom, parentId: parentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Échec de la création de la filiale.');
        return;
      }

      toast.success('Filiale créée avec succès !');
      form.reset();
      onClose();
      getUserProfile(); // Refresh profile to show new subsidiary
    } catch (error) {
      console.error('Erreur de création de filiale:', error);
      toast.error('Erreur réseau ou du serveur lors de la création de la filiale.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle filiale</DialogTitle>
          <DialogDescription>
            Entrez le nom de la nouvelle filiale pour la société avec l'ID: {parentId}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la filiale</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la filiale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubsidiaryModal;
