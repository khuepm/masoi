import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface LLMConfig {
  googleApiKey: string;
  boongaiApiKey: string;
  claudeApiKey: string;
  chatgptApiKey: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  llmConfig: LLMConfig;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateLLMConfig: (config: LLMConfig) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LLM_CONFIG_KEY = 'masoi-llm-config';

function getStoredLLMConfig(userId: string): LLMConfig {
  try {
    const stored = localStorage.getItem(`${LLM_CONFIG_KEY}-${userId}`);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { googleApiKey: '', boongaiApiKey: '', claudeApiKey: '', chatgptApiKey: '' };
}

function storeLLMConfig(userId: string, config: LLMConfig): void {
  try {
    localStorage.setItem(`${LLM_CONFIG_KEY}-${userId}`, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    googleApiKey: '',
    boongaiApiKey: '',
    claudeApiKey: '',
    chatgptApiKey: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLLMConfig(getStoredLLMConfig(s.user.id));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLLMConfig(getStoredLLMConfig(s.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setLLMConfig({ googleApiKey: '', boongaiApiKey: '', claudeApiKey: '', chatgptApiKey: '' });
  }, []);

  const updateLLMConfig = useCallback((config: LLMConfig) => {
    setLLMConfig(config);
    if (user) {
      storeLLMConfig(user.id, config);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      llmConfig,
      signUp,
      signIn,
      signOut,
      updateLLMConfig,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
