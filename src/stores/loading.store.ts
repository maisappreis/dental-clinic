import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  label?: string;
  show: (label?: string) => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  label: undefined,

  show: (label) => set({ isLoading: true, label }),
  hide: () => set({ isLoading: false, label: undefined }),
}));