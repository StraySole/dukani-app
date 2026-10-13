import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    contact: string;
    contactType: 'phone' | 'email';
}

interface StoreContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('dukani_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('dukani_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('dukani_user');
        }
    }, [user]);

    return (
        <StoreContext.Provider value={{ user, setUser }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
