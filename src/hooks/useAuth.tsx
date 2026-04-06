import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
  enterDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  const signOut = async () => {
    setIsDemo(false);
    await firebaseSignOut(auth);
  };

  const enterDemo = () => {
    setIsDemo(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signOut, enterDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}