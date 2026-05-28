import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppUser {
  name: string;
  phone: string;
  type: "Trader" | "Skilled" | "Earner";
  location: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppUser | null;
  login: (user: AppUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("proxi_auth").then((val) => {
      if (val) {
        const parsed = JSON.parse(val);
        setIsAuthenticated(true);
        setUser(parsed);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const login = async (u: AppUser) => {
    await AsyncStorage.setItem("proxi_auth", JSON.stringify(u));
    setUser(u);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("proxi_auth");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
