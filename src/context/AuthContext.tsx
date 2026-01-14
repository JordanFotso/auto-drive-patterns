import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  token: string | null;
  user: { email: string; roles: string[] } | null; // Similaire à UserDetails, sans le password
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, societeId?: string) => Promise<boolean>;
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

  const register = useCallback(async (email, password, societeId) => {
    setLoading(true);
    try {
      const body: { email: string; password: string; societeId?: string } = { email, password };
      if (societeId) {
        body.societeId = societeId;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Échec de l\'inscription.');
        return false;
      }

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Erreur réseau ou du serveur.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    toast.info('Déconnecté.');
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout, loading }}>
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