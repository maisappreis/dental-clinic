import { create } from "zustand";

export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));