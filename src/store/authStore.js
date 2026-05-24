import { create } from "zustand";

const parseUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  user: parseUser(),
  isAuthenticated: !!localStorage.getItem("token"),
  setAuth: ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  }
}));
