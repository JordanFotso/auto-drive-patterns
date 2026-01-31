import { useAuth } from '@/context/AuthContext';
import CustomerProfile from './CustomerProfile';
import CompanyProfile from './CompanyProfile';
import { Loader2 } from 'lucide-react';

const ProfileRouter = () => {
  const { userProfile, loading } = useAuth();

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const isCompanyUser = userProfile.roles?.includes('ROLE_COMPANY_USER');

  if (isCompanyUser) {
    return <CompanyProfile />;
  }

  return <CustomerProfile />;
};

export default ProfileRouter;
