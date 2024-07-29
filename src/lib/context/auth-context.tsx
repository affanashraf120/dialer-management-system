import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect } from "react";

interface AuthProvider {
  children: React.ReactNode;
}

interface IAuthContext {
  accessToken: string;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: AuthProvider) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!session?.access_token) {
          if (!router.pathname.includes("login")) {
            router.push("/login");
          }
        }
      }
    );

    return () => {
      authListener.subscription;
    };
  }, [router, supabase.auth]);

  return (
    <AuthContext.Provider value={{ accessToken: session?.access_token ?? "" }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return { ...context };
}
