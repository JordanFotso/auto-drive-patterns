import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react'; // Importer ArrowLeft
import authBgImage from '@/assets/auth-bg.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen">
        <div className="w-full max-w-md space-y-8 flex flex-col h-full">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Car className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold font-display text-foreground">AutoElite</span>
            </Link>
          </div>
          <div className="flex-grow overflow-y-auto max-h-full pr-2"> {/* Added pr-2 for scrollbar spacing */}
            {children}
          </div>
          <div className="text-center mt-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-gold inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour au site
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative">
        <img
          src={authBgImage}
          alt="Luxury car interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-charcoal" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              L'excellence n'attend pas.
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Rejoignez la communauté AutoElite et accédez à nos services exclusifs. {/* Changement ici */}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
