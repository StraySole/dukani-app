import { useNavigate } from 'react-router';
import { Settings, ShoppingCart, Package, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BottomNav } from './BottomNav';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return formatTime(ts);
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}

export function Home() {
  const navigate = useNavigate();
  const { user, sales, getTodaySales } = useStore();

  const todayTotal = getTodaySales();
  const recentSales = sales.slice(0, 10);

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
          <button onClick={() => navigate('/settings')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold">مرحباً، {user?.name || 'صاحب الدكان'} 👋</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Today's Sales Card */}
          <div className="bg-[#1B5E20] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">مبيعات اليوم</p>
            <p className="text-4xl font-bold">{todayTotal.toLocaleString('ar-EG')} ج.م</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/quick-sale')}
              className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-200 transition-colors min-h-[130px]"
            >
              <ShoppingCart className="w-10 h-10 text-[#1B5E20]" strokeWidth={2} />
              <span className="text-sm font-semibold text-center">بيع سريع</span>
            </button>

            <button
              onClick={() => navigate('/products')}
              className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-200 transition-colors min-h-[130px]"
            >
              <Package className="w-10 h-10 text-[#1B5E20]" strokeWidth={2} />
              <span className="text-sm font-semibold text-center">المنتجات</span>
            </button>

            <button
              onClick={() => navigate('/debts')}
              className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-200 transition-colors min-h-[130px]"
            >
              <Users className="w-10 h-10 text-[#1B5E20]" strokeWidth={2} />
              <span className="text-sm font-semibold text-center">الديون</span>
            </button>
          </div>

          {/* Sales Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => navigate('/reports')} className="text-[#1B5E20] text-sm font-semibold">عرض الكل</button>
              <h3 className="font-semibold text-gray-800">سجل المبيعات</h3>
            </div>

            {recentSales.length === 0 ? (
              <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">لا توجد مبيعات بعد</p>
                <p className="text-gray-400 text-sm mt-1">ابدأ بيع سريع لتظهر هنا</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSales.map(sale => (
                  <div key={sale.id} className="bg-[#F5F5F5] rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="text-[#1B5E20] font-bold">{sale.total} ج.م</div>
                    <div className="flex-1 mx-4 text-right">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {sale.items.map(i => `${i.productName} ×${i.quantity}`).join('، ')}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(sale.timestamp)}</p>
                    </div>
                    <div className="w-8 h-8 bg-[#1B5E20] rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
