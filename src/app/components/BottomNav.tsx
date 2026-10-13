import { useNavigate, useLocation } from 'react-router';
import { Home, Package, Users, BarChart3 } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { path: '/home', icon: Home, label: 'الرئيسية' },
    { path: '/products', icon: Package, label: 'المنتجات' },
    { path: '/debts', icon: Users, label: 'الديون' },
    { path: '/reports', icon: BarChart3, label: 'التقارير' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-4 h-16">
        {tabs.map(tab => {
          const active = pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? 'bg-[#F5F5F5]' : ''}`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-[#1B5E20]' : 'text-gray-400'}`} />
              <span className={`text-xs ${active ? 'text-[#1B5E20] font-semibold' : 'text-gray-400'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
