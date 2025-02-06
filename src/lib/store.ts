import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  completedChallenges: number[];
  setCompletedChallenges: (challenges: number[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  completedChallenges: [],
  setCompletedChallenges: (challenges) => set({ completedChallenges: challenges }),
}));