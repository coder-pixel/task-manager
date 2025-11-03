import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  status: string;
  createdAt: string;
}

export interface Project {
  id: string;
  projectName: string;
  description: string;
  createdAt: string;
  userId: string;
  tasks: Task[];
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (projectName: string, description: string) => Promise<void>;
  setProjects: (projects: Project[]) => void;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      loading: false,
      error: null,

      // Fetch all projects
      fetchProjects: async () => {
        try {
          set({ loading: true, error: null });

          // Get user from localStorage (persisted by authStore)
          const authStorage = localStorage?.getItem("auth-storage");
          const user = authStorage
            ? JSON.parse(authStorage)?.state?.user
            : null;

          if (!user) {
            throw new Error("No user found. Please login again.");
          }

          // call next js api routes to fetch data from firestore database
          const response = await fetch("/api/projects", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.uid}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch projects");
          }

          set({ projects: data.projects || [], loading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Add a new project
      addProject: async (projectName: string, description: string) => {
        try {
          set({ loading: true, error: null });

          // Get user from localStorage (persisted by authStore)
          const authStorage = localStorage.getItem("auth-storage");
          const user = authStorage ? JSON.parse(authStorage).state?.user : null;

          if (!user) {
            throw new Error("No user found. Please login again.");
          }

          const response = await fetch("/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.uid}`,
            },
            body: JSON.stringify({ projectName, description }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to create project");
          }

          // Add the new project to the state
          set((state) => ({
            projects: [...state.projects, data.project],
            loading: false,
          }));

          return data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Set projects
      setProjects: (projects: Project[]) => set({ projects }),

      // Clear projects (useful for logout)
      clearProjects: () => set({ projects: [], error: null }),
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
