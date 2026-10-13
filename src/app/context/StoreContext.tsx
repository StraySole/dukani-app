import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  boxes: number;
}

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: number;
  items: SaleItem[];
  total: number;
  timestamp: number;
}

export interface Transaction {
  id: number;
  timestamp: number;
  amount: number;
  type: 'debt' | 'payment';
  note: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  transactions: Transaction[];
}

export interface UserInfo {
  name: string;
  contact: string;
  contactType: 'email' | 'phone';
}

interface StoreContextType {
  user: UserInfo | null;
  setUser: (u: UserInfo) => void;
  updateUser: (u: Partial<UserInfo>) => void;

  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: number) => void;

  sales: Sale[];
  addSale: (items: SaleItem[]) => void;
  getTodaySales: () => number;
  getWeekSales: () => number;

  customers: Customer[];
  addCustomer: (name: string, phone: string) => number;
  deleteCustomer: (id: number) => void;
  addDebt: (customerId: number, amount: number, note: string) => void;
  addPayment: (customerId: number, amount: number, note: string) => void;
  getTotalDebt: () => number;
  getCustomerDebt: (customerId: number) => number;
  getCustomer: (id: number | string) => Customer | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

function load<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v);
  } catch {}
  return def;
}

function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(() => load('dk_user', null));
  const [products, setProducts] = useState<Product[]>(() => load('dk_products', []));
  const [sales, setSales] = useState<Sale[]>(() => load('dk_sales', []));
  const [customers, setCustomers] = useState<Customer[]>(() => load('dk_customers', []));

  const setUser = (u: UserInfo) => { setUserState(u); save('dk_user', u); };
  const updateUser = (u: Partial<UserInfo>) => {
    setUserState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...u };
      save('dk_user', updated);
      return updated;
    });
  };

  const addProduct = (p: Omit<Product, 'id'>) => {
    const np: Product = { ...p, id: Date.now() };
    setProducts(prev => { const u = [...prev, np]; save('dk_products', u); return u; });
  };

  const updateProduct = (id: number, updates: Partial<Omit<Product, 'id'>>) => {
    setProducts(prev => {
      const u = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      save('dk_products', u); return u;
    });
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => { const u = prev.filter(p => p.id !== id); save('dk_products', u); return u; });
  };

  const addSale = (items: SaleItem[]) => {
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const ns: Sale = { id: Date.now(), items, total, timestamp: Date.now() };
    setProducts(prev => {
      const u = prev.map(p => {
        const si = items.find(i => i.productId === p.id);
        return si ? { ...p, quantity: Math.max(0, p.quantity - si.quantity) } : p;
      });
      save('dk_products', u); return u;
    });
    setSales(prev => { const u = [ns, ...prev]; save('dk_sales', u); return u; });
  };

  const getTodaySales = () => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return sales.filter(s => s.timestamp >= t.getTime()).reduce((sum, s) => sum + s.total, 0);
  };

  const getWeekSales = () => {
    const t = new Date(); t.setDate(t.getDate() - 7); t.setHours(0, 0, 0, 0);
    return sales.filter(s => s.timestamp >= t.getTime()).reduce((sum, s) => sum + s.total, 0);
  };

  const addCustomer = (name: string, phone: string): number => {
    const nc: Customer = { id: Date.now(), name, phone, transactions: [] };
    setCustomers(prev => { const u = [...prev, nc]; save('dk_customers', u); return u; });
    return nc.id;
  };

  const deleteCustomer = (id: number) => {
    setCustomers(prev => { const u = prev.filter(c => c.id !== id); save('dk_customers', u); return u; });
  };

  const addDebt = (customerId: number, amount: number, note: string) => {
    const t: Transaction = { id: Date.now(), timestamp: Date.now(), amount, type: 'debt', note };
    setCustomers(prev => {
      const u = prev.map(c => c.id === customerId ? { ...c, transactions: [t, ...c.transactions] } : c);
      save('dk_customers', u); return u;
    });
  };

  const addPayment = (customerId: number, amount: number, note: string) => {
    const t: Transaction = { id: Date.now(), timestamp: Date.now(), amount, type: 'payment', note };
    setCustomers(prev => {
      const u = prev.map(c => c.id === customerId ? { ...c, transactions: [t, ...c.transactions] } : c);
      save('dk_customers', u); return u;
    });
  };

  const getTotalDebt = () =>
    customers.reduce((total, c) => total + Math.max(0, c.transactions.reduce((s, t) => t.type === 'debt' ? s + t.amount : s - t.amount, 0)), 0);

  const getCustomerDebt = (customerId: number) => {
    const c = customers.find(x => x.id === customerId);
    if (!c) return 0;
    return Math.max(0, c.transactions.reduce((s, t) => t.type === 'debt' ? s + t.amount : s - t.amount, 0));
  };

  const getCustomer = (id: number | string) => customers.find(c => c.id === Number(id));

  return (
    <StoreContext.Provider value={{
      user, setUser, updateUser,
      products, addProduct, updateProduct, deleteProduct,
      sales, addSale, getTodaySales, getWeekSales,
      customers, addCustomer, deleteCustomer, addDebt, addPayment,
      getTotalDebt, getCustomerDebt, getCustomer,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
