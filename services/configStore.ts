import { create } from 'zustand';
import { Config } from '@/types/config';

interface ConfigStore {
  config: Config['data'] | null;
  setConfig: (config: Config['data']) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));