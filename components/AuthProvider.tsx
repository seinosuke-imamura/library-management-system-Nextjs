"use client";

import { AuthUser } from "@/types";

import { createContext, useContext, useState} from "react";


const AuthContext = createContext<{
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}>({
    user: null,
    setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("AuthProviderの内側で使用してください");
    }
    return ctx;
};