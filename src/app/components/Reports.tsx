import { useNavigate } from 'react-router';
import { TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BottomNav } from './BottomNav';

export function Reports() {
  const navigate = useNavigate();
  const { products, sales, getTodaySales, getWeekSales, getTotalDebt } = useStore();

  const todayTotal = getTodaySales();
  const weekTotal = getWeekSales();
  const totalDebt = getTotalDebt();

  // Calculate top products from sales
  const productSalesMap: Record<number, { name: string; count: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, count: 0 };
      }
      productSalesMap[item.productId].count += item.quantity;
    });
  });
  const topProducts = Object.entries(productSalesMap)
    .map(([, v]) => v)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Low stock (quantity < 5)
  const lowStock = products.filter(p => p.quantity < 5);

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center border-b">
          <h2 className="text-xl font-semibold flex-1 text-center">التقارير</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Stats */}
          <div className="space-y-3">
            <div className="bg-[#1B5E20] rounded-2xl p-6 text-white">
              <p className="text-sm opacity-90 mb-2">مبيعات اليوم</p>
              <p className="text-3xl font-bold">{todayTotal.toLocaleString('ar-EG')} ج.م</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F5F5F5] rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">مبيعات الأسبوع</p>
                <p className="text-2xl font-bold text-[#1B5E20]">{weekTotal.toLocaleString('ar-EG')} ج.م</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">إجمالي الديون</p>
                <p className="text-2xl font-bold text-red-600">{totalDebt.toLocaleString('ar-EG')} ج.م</p>
              </div>
            </div>

            <div className="bg-[#F5F5F5] rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-800">{products.length} منتج</p>
            </div>
          </div>

          {/* Top Products */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1B5E20]" />
              <h3 className="font-semibold">الأكثر مبيعاً</h3>
            </div>

            {topProducts.length === 0 ? (
              <div className="bg-[#F5F5F5] rounded-xl p-6 text-center">
                <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">لا توجد مبيعات بعد</p>
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B5E20] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#1B5E20]">{product.count} قطعة</span>
                  </div>
                  <span className="font-semibold text-right">{product.name}</span>
                </div>
              ))
            )}
          </div>

          {/* Low Stock Alerts */}
          {lowStock.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-orange-600">تنبيهات المخزون</h3>
              </div>
              {lowStock.map(product => (
                <div key={product.id} className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-orange-600 font-bold">
                    {product.quantity === 0 ? 'نفذت الكمية' : `باقي ${product.quantity} قطعة`}
                  </div>
                  <span className="font-semibold">{product.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Sales Log */}
          <div className="space-y-3">
            <h3 className="font-semibold">آخر المبيعات</h3>
            {sales.length === 0 ? (
              <div className="bg-[#F5F5F5] rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm">لا توجد مبيعات مسجلة</p>
              </div>
            ) : (
              sales.slice(0, 20).map(sale => (
                <div key={sale.id} className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#1B5E20] font-bold">{sale.total} ج.م</span>
                    <span className="text-xs text-gray-400">
                      {new Date(sale.timestamp).toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 text-right">
                    {sale.items.map(i => `${i.productName} ×${i.quantity}`).join('، ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
