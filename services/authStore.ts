import { CustomerInfo } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  customerInfo: CustomerInfo | null;
  isAuthenticated: boolean;
  login: (token: string, expiresAt: string, customerInfo: CustomerInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  expiresAt: null,
  customerInfo: null,
  isAuthenticated: false,
  login: (token, expiresAt, customerInfo) => 
    set({ token, expiresAt, customerInfo, isAuthenticated: true }),
  logout: () => 
    set({ token: null, expiresAt: null, customerInfo: null, isAuthenticated: false }),
}));