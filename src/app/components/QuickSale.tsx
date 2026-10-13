import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Search, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function QuickSale() {
  const navigate = useNavigate();
  const { products, addSale } = useStore();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (id: number) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: number) => setCart(prev => {
    const qty = (prev[id] || 0) - 1;
    if (qty <= 0) { const n = { ...prev }; delete n[id]; return n; }
    return { ...prev, [id]: qty };
  });
  const clearItem = (id: number) => setCart(prev => { const n = { ...prev }; delete n[id]; return n; });

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    return sum + (p?.price || 0) * qty;
  }, 0);

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    return p ? { product: p, qty } : null;
  }).filter(Boolean) as { product: typeof products[0]; qty: number }[];

  const handleConfirmSale = () => {
    if (cartItems.length === 0) return;
    addSale(cartItems.map(({ product, qty }) => ({
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: product.price,
    })));
    navigate('/success', { state: { message: 'تم تسجيل البيع', returnTo: '/home' } });
  };

  return (
    <div className="min-h-screen bg-white pb-36" dir="rtl">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center border-b sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mr-4">بيع سريع</h2>
        {cartItems.length > 0 && (
          <div className="mr-auto bg-[#1B5E20] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cartItems.length}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full h-12 pr-4 pl-12 bg-[#F5F5F5] rounded-xl text-right outline-none focus:ring-2 focus:ring-[#1B5E20]"
            dir="rtl"
          />
        </div>
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="px-6 pb-4">
          <h3 className="text-sm text-gray-600 mb-3 font-semibold">السلة</h3>
          <div className="bg-[#F5F5F5] rounded-2xl p-3 space-y-2">
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => clearItem(product.id)} className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1">
                    <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 bg-[#F5F5F5] rounded flex items-center justify-center">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{qty}</span>
                    <button onClick={() => addToCart(product.id)} className="w-7 h-7 bg-[#1B5E20] rounded flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-[#1B5E20]">{product.price * qty} ج.م</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="px-6 space-y-2">
        <h3 className="text-sm text-gray-600 mb-3 font-semibold">المنتجات</h3>

        {products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد منتجات</p>
            <button onClick={() => navigate('/add-product')} className="mt-4 px-6 h-12 bg-[#1B5E20] text-white rounded-xl font-semibold hover:bg-[#145018] transition-colors">
              أضف منتج الآن
            </button>
          </div>
        )}

        {filtered.map(product => (
          <div key={product.id} className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
            <button
              onClick={() => addToCart(product.id)}
              className="w-11 h-11 bg-[#1B5E20] rounded-xl flex items-center justify-center hover:bg-[#145018] transition-colors flex-shrink-0"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-right mx-4">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-[#1B5E20] font-bold mt-0.5">{product.price} ج.م</p>
            </div>
            {cart[product.id] ? (
              <div className="bg-[#1B5E20] text-white rounded-lg px-3 py-1.5 min-w-[40px] text-center">
                <span className="font-bold">{cart[product.id]}</span>
              </div>
            ) : (
              <div className="w-10 h-8 bg-gray-200 rounded-lg text-center">
                <span className="text-xs text-gray-400 leading-8">كمية: {product.quantity}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Confirm */}
      {total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-[#1B5E20]">{total} ج.م</span>
            <span className="text-gray-600 font-semibold">الإجمالي</span>
          </div>
          <button
            onClick={handleConfirmSale}
            className="w-full h-14 bg-[#1B5E20] text-white rounded-xl text-xl font-semibold hover:bg-[#145018] transition-colors"
          >
            تأكيد البيع
          </button>
        </div>
      )}
    </div>
  );
}
