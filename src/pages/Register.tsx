import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Lock, Building, Phone, Home, Calendar, CreditCard, User as UserIcon, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const registerSchema = z.object({
  email: z.string().email('Format email invalide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  userType: z.enum(['customer', 'company']),

  // Customer specific fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(), // Date of Birth as String
  bankAccountNumber: z.string().optional(),

  // Company specific fields
  companyName: z.string().optional(),
  contactPersonName: z.string().optional(),
  companyRegistrationNumber: z.string().optional(),
  website: z.string().optional(),
  companyBankAccountNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.userType === 'customer') {
    if (!data.firstName || data.firstName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le prénom est requis pour les clients.',
        path: ['firstName'],
      });
    }
    if (!data.lastName || data.lastName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le nom de famille est requis pour les clients.',
        path: ['lastName'],
      });
    }
    if (!data.phone || data.phone.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le téléphone est requis pour les clients.',
        path: ['phone'],
      });
    }
    if (!data.address || data.address.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'adresse est requise pour les clients.',
        path: ['address'],
      });
    }
    if (!data.dob || data.dob.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La date de naissance est requise pour les clients.',
        path: ['dob'],
      });
    }
    // Minimal validation for bank account number
    if (!data.bankAccountNumber || data.bankAccountNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le numéro de compte bancaire est requis pour les clients.',
        path: ['bankAccountNumber'],
      });
    }

  } else if (data.userType === 'company') {
    if (!data.companyName || data.companyName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le nom de l\'entreprise est requis.',
        path: ['companyName'],
      });
    }
    if (!data.contactPersonName || data.contactPersonName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le nom de la personne de contact est requis pour les entreprises.',
        path: ['contactPersonName'],
      });
    }
    if (!data.phone || data.phone.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le téléphone est requis pour les entreprises.',
        path: ['phone'],
      });
    }
    if (!data.address || data.address.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'adresse est requise pour les entreprises.',
        path: ['address'],
      });
    }
    if (!data.companyRegistrationNumber || data.companyRegistrationNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le numéro d\'enregistrement de l\'entreprise est requis.',
        path: ['companyRegistrationNumber'],
      });
    }
    if (!data.website || data.website.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le site web de l\'entreprise est requis.',
        path: ['website'],
      });
    }
    if (!data.companyBankAccountNumber || data.companyBankAccountNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le numéro de compte bancaire de l\'entreprise est requis.',
        path: ['companyBankAccountNumber'],
      });
    }
  }
});

const Register = () => {
  const navigate = useNavigate();
  const { registerCustomer, registerCompanyUser, isAuthenticated } = useAuth();
  const [userType, setUserType] = useState<'customer' | 'company'>('customer');

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'customer',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      dob: '',
      bankAccountNumber: '',
      companyName: '',
      contactPersonName: '',
      companyRegistrationNumber: '',
      website: '',
      companyBankAccountNumber: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    let success = false;
    if (values.userType === 'customer') {
      success = await registerCustomer(
        values.email,
        values.password,
        values.firstName || '',
        values.lastName || '',
        values.phone || '',
        values.address || '',
        values.dob || '',
        values.bankAccountNumber || ''
      );
    } else if (values.userType === 'company') {
      success = await registerCompanyUser(
        values.email,
        values.password,
        values.companyName || '',
        values.contactPersonName || '',
        values.phone || '',
        values.address || '',
        values.companyRegistrationNumber || '',
        values.website || '',
        values.companyBankAccountNumber || ''
      );
    }

    if (success) {
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Créez votre compte</h1>
          <p className="text-muted-foreground">Rejoignez-nous en quelques secondes.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Vous êtes ?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setUserType(value as 'customer' | 'company');
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="customer" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Un Particulier
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="company" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Une Entreprise
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="votre.email@example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="********" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === 'customer' && (
              <>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Votre prénom" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de famille</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Votre nom de famille" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="tel" placeholder="Votre numéro de téléphone" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Votre adresse complète" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de compte bancaire</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Votre numéro de compte bancaire" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {userType === 'company' && (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Nom de votre entreprise" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la personne de contact</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Nom du contact principal" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="tel" placeholder="Numéro de téléphone de l'entreprise" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Adresse complète de l'entreprise" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyRegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro d'enregistrement de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Numéro SIRET/SIREN, etc." className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="url" placeholder="https://www.votresite.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyBankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de compte bancaire de l'entreprise</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="text" placeholder="Numéro de compte bancaire de l'entreprise" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-gold hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
