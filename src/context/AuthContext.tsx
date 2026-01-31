import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  token: string | null;
  user: { email: string; roles: string[] } | null; // Similaire à UserDetails, sans le password
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (email: string, password: string, firstName: string, lastName: string, phone: string, address: string, dob: string, bankAccountNumber: string) => Promise<boolean>;
  registerCompanyUser: (email: string, password: string, companyName: string, contactPersonName: string, phone: string, address: string, companyRegistrationNumber: string, website: string, companyBankAccountNumber: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_TOKEN_KEY = 'jwt_token';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY));
  const [user, setUser] = useState<{ email: string; roles: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les infos utilisateur depuis le token
  useEffect(() => {
    if (token) {
      try {
        // Dans une vraie application, vous décoderiez le token pour obtenir les infos utilisateur
        // Pour l'instant, on se contente de l'email pour la démo
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: decodedToken.sub, roles: [] }); // Les rôles ne sont pas encore dans le token ici
      } catch (e) {
        console.error("Failed to decode token", e);
        setToken(null);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Échec de la connexion.');
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur réseau ou du serveur.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerCustomer = useCallback(async (email, password, firstName, lastName, phone, address, dob, bankAccountNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, phone, address, dob, bankAccountNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Échec de l\'inscription client.');
        return false;
      }

      toast.success('Inscription client réussie ! Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error) {
      console.error('Register customer error:', error);
      toast.error('Erreur réseau ou du serveur.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerCompanyUser = useCallback(async (email, password, companyName, contactPersonName, phone, address, companyRegistrationNumber, website, companyBankAccountNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, companyName, contactPersonName, phone, address, companyRegistrationNumber, website, companyBankAccountNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Échec de l\'inscription entreprise.');
        return false;
      }

      toast.success('Inscription entreprise réussie ! Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error) {
      console.error('Register company user error:', error);
      toast.error('Erreur réseau ou du serveur.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const [userProfile, setUserProfile] = useState<any | null>(null);

  const getUserProfile = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile");
          // Optionally handle token expiration or other errors here
        }
      } catch (error) {
        console.error('Network error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [token]);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      getUserProfile();
    }
  }, [isAuthenticated, getUserProfile]);
  
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    toast.info('Déconnecté.');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, userProfile, isAuthenticated, login, registerCustomer, registerCompanyUser, logout, getUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};