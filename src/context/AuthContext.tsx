import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (fullName: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const persistUserDetails = (user: User | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (!user) {
      localStorage.removeItem("teacherOS_user");
      return;
    }

    const fullName = (user.user_metadata?.full_name as string) || user.email || "";
    localStorage.setItem(
      "teacherOS_user",
      JSON.stringify({ name: fullName, email: user.email ?? "" }),
    );
  };

  useEffect(() => {
    let isMounted = true;

    const restore = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Supabase session restore failed:", error.message);
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      persistUserDetails(currentSession?.user ?? null);
      setLoading(false);
    };

    restore();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, currentSession) => {
      if (!isMounted) {
        return;
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      const activeSession = data?.session ?? (await supabase.auth.getSession()).data.session;
      if (activeSession) {
        setSession(activeSession);
        setUser(activeSession.user ?? null);
        persistUserDetails(activeSession.user ?? null);
      }
    }

    return { error };
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (!error) {
      const activeSession = data?.session ?? (await supabase.auth.getSession()).data.session;
      if (activeSession) {
        setSession(activeSession);
        setUser(activeSession.user ?? null);
        persistUserDetails(activeSession.user ?? null);
      }
    }

    return { error };
  };

  const updateProfile = async (fullName: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (!error) {
      const updatedUser = data?.user ?? null;
      setUser(updatedUser);
      persistUserDetails(updatedUser);
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setUser(null);
      persistUserDetails(null);
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
