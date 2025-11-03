import { create } from "zustand";
import { persist } from "zustand/middleware";

import { signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // fn to sign in
      signIn: async (email: string, password: string) => {
        try {
          // Call Next.js API route for secure server side authentication
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to sign in");
          }

          set({ user: data?.user, token: data?.token });
          return data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw error;
        }
      },

      // fn to sign up
      signUp: async (email: string, password: string) => {
        try {
          // Call Next.js API route
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to sign up");
          }

          set({ user: data?.user, token: data?.token });
          return data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw error;
        }
      },

      // fn to sign out
      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null, token: null });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw error;
        }
      },

      // fn to set user
      setUser: (user: User | null) => set({ user }),
    }),
    {
      // unique name for localStorage key
      name: "auth-storage",
      // only persist user and token
      partialize: (state) => ({
        user: state?.user,
        token: state?.token,
      }),
    }
  )
);

// Initialize auth state listener
